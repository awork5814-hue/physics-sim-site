require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'physics_sim_secret_key_change_in_production';
const JWT_EXPIRY = '30d';

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_PUBLIC_KEY = process.env.PAYMOB_PUBLIC_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID;
const PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL || 'https://accept.paymob.com';

const PAYTABS_PROFILE_ID = process.env.PAYTABS_PROFILE_ID;
const PAYTABS_SERVER_KEY = process.env.PAYTABS_SERVER_KEY;
const PAYTABS_BASE_URL = process.env.PAYTABS_BASE_URL || 'https://secure-egypt.paytabs.com';

const PLANS = {
  yearly: { amountEGP: 300, amountUSD: 10, name: 'Yearly Subscription', months: 12 },
  monthly: { amountEGP: 50, amountUSD: 1, name: 'Monthly Subscription', months: 1 }
};

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

let db;
let isTurso = false;
let SQL;

console.log('TURSO_URL:', TURSO_URL ? 'set' : 'not set');
console.log('TURSO_TOKEN:', TURSO_TOKEN ? 'set' : 'not set');

async function initDatabase() {
  console.log('Initializing sql.js...');
  const initSqlJs = require('sql.js');
  SQL = await initSqlJs();
  db = new SQL.Database();
  
  db.prepare = (sql) => ({
    run: (...params) => { db.run(sql, params); return { changes: db.getRowsModified() }; },
    get: (...params) => { const stmt = db.prepare(sql); stmt.bind(params); if (stmt.step()) { const row = stmt.getAsObject(); stmt.free(); return row; } stmt.free(); return null; },
    all: (...params) => { const results = []; const stmt = db.prepare(sql); stmt.bind(params); while (stmt.step()) results.push(stmt.getAsObject()); stmt.free(); return results; }
  });
  
  db.exec = (sql) => { db.run(sql); };
  
  console.log('Using in-memory SQLite (sql.js)');
}

async function initDb() {
  console.log('initDb called, creating tables...');
  console.log('db object:', typeof db);
  console.log('db.prepare:', typeof db.prepare);
  console.log('Creating database tables...');
  
  try {
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_login TEXT,
      plan TEXT DEFAULT 'free',
      plan_expiry TEXT,
      subscription_txn_id TEXT,
      reset_token TEXT,
      reset_token_expiry TEXT,
      avatar TEXT,
      email_verified INTEGER DEFAULT 0,
      verify_token TEXT,
      verify_token_expiry TEXT
    );

    CREATE TABLE IF NOT EXISTS user_data (
      user_id TEXT PRIMARY KEY,
      favorites TEXT DEFAULT '[]',
      achievements TEXT DEFAULT '[]',
      quiz_progress TEXT DEFAULT '{}',
      streak_count INTEGER DEFAULT 0,
      streak_last_date TEXT,
      settings TEXT DEFAULT '{}',
      local_storage_data TEXT DEFAULT '{}',
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      plan TEXT NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT DEFAULT 'EGP',
      txn_id TEXT,
      paymob_order_id TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      expires_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS paytabs_orders (
      cart_id TEXT PRIMARY KEY,
      user_id TEXT,
      plan TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'pending',
      tran_ref TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payment_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider TEXT NOT NULL,
      event_type TEXT NOT NULL,
      status TEXT DEFAULT 'info',
      order_id TEXT,
      amount REAL,
      currency TEXT,
      user_id TEXT,
      txn_id TEXT,
      payload TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_paytabs_orders_user ON paytabs_orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_payment_events_provider ON payment_events(provider);
    CREATE INDEX IF NOT EXISTS idx_payment_events_order ON payment_events(order_id);
  `);
  console.log('Database tables initialized');
}

const oldInitDb = async () => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_login TEXT,
      plan TEXT DEFAULT 'free',
      plan_expiry TEXT,
      subscription_txn_id TEXT,
      reset_token TEXT,
      reset_token_expiry TEXT,
      avatar TEXT,
      email_verified INTEGER DEFAULT 0,
      verify_token TEXT,
      verify_token_expiry TEXT
    );

    CREATE TABLE IF NOT EXISTS user_data (
      user_id TEXT PRIMARY KEY,
      favorites TEXT DEFAULT '[]',
      achievements TEXT DEFAULT '[]',
      quiz_progress TEXT DEFAULT '{}',
      streak_count INTEGER DEFAULT 0,
      streak_last_date TEXT,
      settings TEXT DEFAULT '{}',
      local_storage_data TEXT DEFAULT '{}',
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      plan TEXT NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT DEFAULT 'EGP',
      txn_id TEXT,
      paymob_order_id TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      expires_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS paytabs_orders (
      cart_id TEXT PRIMARY KEY,
      user_id TEXT,
      plan TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'pending',
      tran_ref TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payment_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider TEXT NOT NULL,
      event_type TEXT NOT NULL,
      status TEXT DEFAULT 'info',
      order_id TEXT,
      amount REAL,
      currency TEXT,
      user_id TEXT,
      txn_id TEXT,
      payload TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_paytabs_orders_user ON paytabs_orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_payment_events_provider ON payment_events(provider);
    CREATE INDEX IF NOT EXISTS idx_payment_events_order ON payment_events(order_id);
  `);
    console.log('Database tables initialized');
  } catch (e) {
    console.error('Error creating tables:', e);
  }
};

const hashPassword = (password) => bcrypt.hashSync(password, 10);
const verifyPassword = (password, hash) => bcrypt.compareSync(password, hash);
const generateToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  req.userId = decoded.userId;
  next();
};

const emailConfig = {
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

if (process.env.EMAIL_HOST) {
  emailConfig.host = process.env.EMAIL_HOST;
  emailConfig.port = parseInt(process.env.EMAIL_PORT) || 587;
  emailConfig.secure = process.env.EMAIL_SECURE === 'true';
}

const emailTransporter = nodemailer.createTransport(emailConfig);

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log('Signup attempt:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    console.log('Checking existing user...');
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    console.log('Existing user:', existing);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const userId = uuidv4();
    const passwordHash = hashPassword(password);
    const verifyToken = uuidv4();
    const verifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    console.log('Inserting user...');
    await db.prepare('INSERT INTO users (id, email, password_hash, name, verify_token, verify_token_expiry) VALUES (?, ?, ?, ?, ?, ?)').run(
      userId,
      email.toLowerCase(),
      passwordHash,
      name || '',
      verifyToken,
      verifyExpiry
    );
    console.log('User inserted');

    await db.prepare('INSERT INTO user_data (user_id) VALUES (?)').run(userId);
    console.log('User data inserted');

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const verifyUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/verify-email?token=${verifyToken}`;
      
      try {
        await emailTransporter.sendMail({
          from: process.env.EMAIL_FROM || 'noreply@physicssim.com',
          to: email,
          subject: 'Verify Your Physics Sim Account',
          html: `
            <h2>Welcome to Physics Experiments Lab!</h2>
            <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
            <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#6ad7ff;color:#0a0a0f;text-decoration:none;border-radius:8px;font-weight:bold;">Verify Email</a>
            <p style="margin-top:20px;color:#666;">This link expires in 24 hours.</p>
          `
        });
      } catch (emailError) {
        console.log('Email sending skipped (no SMTP configured)');
      }
    }

    const token = generateToken(userId);
    const user = await db.prepare('SELECT id, email, name, created_at, last_login, plan, plan_expiry, email_verified FROM users WHERE id = ?').get(userId);

    res.json({ 
      success: true, 
      token, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '',
        plan: user.plan,
        planExpiry: user.plan_expiry,
        emailVerified: !!user.email_verified
      },
      needsVerification: true
    });
  } catch (error) {
    console.error('Signup error:', error);
    console.error('Signup error stack:', error.stack);
    res.status(500).json({ error: 'Signup failed: ' + error.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    await db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

    const token = generateToken(user.id);
    
    const userData = await db.prepare('SELECT id, email, name, created_at, last_login, plan, plan_expiry, email_verified FROM users WHERE id = ?').get(user.id);
    const progressData = await db.prepare('SELECT * FROM user_data WHERE user_id = ?').get(user.id);

    res.json({ 
      success: true, 
      token, 
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name || '',
        plan: userData.plan,
        planExpiry: userData.plan_expiry,
        emailVerified: !!userData.email_verified
      },
      userData: progressData ? {
        favorites: JSON.parse(progressData.favorites || '[]'),
        achievements: JSON.parse(progressData.achievements || '[]'),
        quizProgress: JSON.parse(progressData.quiz_progress || '{}'),
        streakCount: progressData.streak_count,
        streakLastDate: progressData.streak_last_date,
        settings: JSON.parse(progressData.settings || '{}')
      } : null
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Signin failed' });
  }
});

app.post('/api/auth/verify', authMiddleware, (req, res) => {
  const user = getUserPublicData(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ success: true, user });
});

app.get('/api/auth/user-data', authMiddleware, async (req, res) => {
  const userData = await db.prepare('SELECT * FROM user_data WHERE user_id = ?').get(req.userId);
  if (!userData) {
    return res.json({ success: true, data: null });
  }
  res.json({
    success: true,
    data: {
      favorites: JSON.parse(userData.favorites || '[]'),
      achievements: JSON.parse(userData.achievements || '[]'),
      quizProgress: JSON.parse(userData.quiz_progress || '{}'),
      streakCount: userData.streak_count,
      streakLastDate: userData.streak_last_date,
      settings: JSON.parse(userData.settings || '{}')
    }
  });
});

app.post('/api/auth/user-data', authMiddleware, async (req, res) => {
  const { favorites, achievements, quizProgress, streakCount, streakLastDate, settings } = req.body;
  
  const updates = [];
  const values = [];

  if (favorites !== undefined) {
    updates.push('favorites = ?');
    values.push(JSON.stringify(favorites));
  }
  if (achievements !== undefined) {
    updates.push('achievements = ?');
    values.push(JSON.stringify(achievements));
  }
  if (quizProgress !== undefined) {
    updates.push('quiz_progress = ?');
    values.push(JSON.stringify(quizProgress));
  }
  if (streakCount !== undefined) {
    updates.push('streak_count = ?');
    values.push(streakCount);
  }
  if (streakLastDate !== undefined) {
    updates.push('streak_last_date = ?');
    values.push(streakLastDate);
  }
  if (settings !== undefined) {
    updates.push('settings = ?');
    values.push(JSON.stringify(settings));
  }

  if (updates.length > 0) {
    values.push(req.userId);
    db.prepare(`UPDATE user_data SET ${updates.join(', ')} WHERE user_id = ?`).run(...values);
  }

  res.json({ success: true });
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    
    if (!user) {
      return res.json({ success: true, message: 'If email exists, reset instructions will be sent' });
    }

    const resetToken = uuidv4();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await db.prepare('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?').run(
      resetToken,
      resetExpiry,
      user.id
    );

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const resetUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      await emailTransporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@physicssim.com',
        to: email,
        subject: 'Reset Your Physics Sim Password',
        html: `
          <h2>Password Reset Request</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, ignore this email.</p>
        `
      });
    }

    res.json({ success: true, message: 'If email exists, reset instructions will be sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.json({ success: true, message: 'If email exists, reset instructions will be sent' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = db.prepare('SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?').get(
      token,
      new Date().toISOString()
    );

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const passwordHash = hashPassword(password);
    await db.prepare('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?').run(
      passwordHash,
      user.id
    );

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

app.post('/api/auth/send-verification', authMiddleware, async (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.email_verified) {
      return res.json({ success: true, message: 'Email already verified' });
    }
    
    const verifyToken = uuidv4();
    const verifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    db.prepare('UPDATE users SET verify_token = ?, verify_token_expiry = ? WHERE id = ?').run(
      verifyToken,
      verifyExpiry,
      user.id
    );
    
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const verifyUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/verify-email?token=${verifyToken}`;
      
      await emailTransporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@physicssim.com',
        to: user.email,
        subject: 'Verify Your Physics Sim Account',
        html: `
          <h2>Welcome to Physics Experiments Lab!</h2>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#6ad7ff;color:#0a0a0f;text-decoration:none;border-radius:8px;font-weight:bold;">Verify Email</a>
          <p style="margin-top:20px;">This link expires in 24 hours.</p>
        `
      });
    }
    
    res.json({ success: true, message: 'Verification email sent' });
  } catch (error) {
    console.error('Send verification error:', error);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
});

app.get('/api/auth/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    const user = db.prepare('SELECT * FROM users WHERE verify_token = ? AND verify_token_expiry > ?').get(
      token,
      new Date().toISOString()
    );
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }
    
    db.prepare('UPDATE users SET email_verified = 1, verify_token = NULL, verify_token_expiry = NULL WHERE id = ?').run(user.id);
    
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

app.get('/api/auth/profile', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, email, name, created_at, last_login, plan, plan_expiry, email_verified, avatar FROM users WHERE id = ?').get(req.userId);
  const userData = db.prepare('SELECT * FROM user_data WHERE user_id = ?').get(req.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    success: true,
    profile: {
      id: user.id,
      email: user.email,
      name: user.name || '',
      createdAt: user.created_at,
      lastLogin: user.last_login,
      plan: user.plan,
      planExpiry: user.plan_expiry,
      emailVerified: !!user.email_verified,
      avatar: user.avatar || null
    },
    userData: userData ? {
      favorites: JSON.parse(userData.favorites || '[]'),
      achievements: JSON.parse(userData.achievements || '[]'),
      quizProgress: JSON.parse(userData.quiz_progress || '{}'),
      streakCount: userData.streak_count,
      streakLastDate: userData.streak_last_date,
      settings: JSON.parse(userData.settings || '{}')
    } : null
  });
});

app.post('/api/auth/avatar', authMiddleware, (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }
    
    const match = image.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ error: 'Invalid image format' });
    }
    
    let ext = match[1].toLowerCase();
    const data = match[2];
    
    if (!['jpeg', 'jpg', 'png', 'gif', 'webp'].includes(ext)) {
      return res.status(400).json({ error: 'Invalid image type. Use JPEG, PNG, GIF, or WebP' });
    }
    
    if (ext === 'jpg') ext = 'jpeg';
    
    const buf = Buffer.from(data, 'base64');
    if (buf.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image too large. Max 5MB' });
    }
    
    const filename = `${req.userId}.${ext}`;
    const filepath = path.join(__dirname, 'uploads', 'avatars', filename);
    
    const oldUser = db.prepare('SELECT avatar FROM users WHERE id = ?').get(req.userId);
    if (oldUser?.avatar) {
      const oldPath = path.join(__dirname, 'uploads', 'avatars', oldUser.avatar);
      try { require('fs').unlinkSync(oldPath); } catch (e) {}
    }
    
    require('fs').writeFileSync(filepath, buf);
    
    db.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(filename, req.userId);
    
    res.json({ success: true, avatar: filename });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

app.delete('/api/auth/avatar', authMiddleware, (req, res) => {
  try {
    const user = db.prepare('SELECT avatar FROM users WHERE id = ?').get(req.userId);
    
    if (user?.avatar) {
      const filepath = path.join(__dirname, 'uploads', 'avatars', user.avatar);
      try { require('fs').unlinkSync(filepath); } catch (e) {}
      db.prepare('UPDATE users SET avatar = NULL WHERE id = ?').run(req.userId);
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete avatar' });
  }
});

app.put('/api/auth/profile', authMiddleware, (req, res) => {
  try {
    const { name, email } = req.body;
    const updates = [];
    const values = [];
    
    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    
    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      
      const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email.toLowerCase(), req.userId);
      if (existing) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      
      updates.push('email = ?');
      values.push(email.toLowerCase());
      updates.push('email_verified = 0');
    }
    
    if (updates.length > 0) {
      values.push(req.userId);
      db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }
    
    const user = db.prepare('SELECT id, email, name, email_verified FROM users WHERE id = ?').get(req.userId);
    res.json({
      success: true,
      profile: {
        id: user.id,
        email: user.email,
        name: user.name || '',
        emailVerified: !!user.email_verified
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.put('/api/auth/change-password', authMiddleware, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!verifyPassword(currentPassword, user.password_hash)) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    const passwordHash = hashPassword(newPassword);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, user.id);
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

app.delete('/api/auth/account', authMiddleware, (req, res) => {
  try {
    db.prepare('DELETE FROM user_data WHERE user_id = ?').run(req.userId);
    db.prepare('DELETE FROM subscriptions WHERE user_id = ?').run(req.userId);
    db.prepare('DELETE FROM users WHERE id = ?').run(req.userId);
    
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

app.post('/api/auth/merge-local-data', authMiddleware, (req, res) => {
  try {
    const { localData } = req.body;
    
    const userData = db.prepare('SELECT * FROM user_data WHERE user_id = ?').get(req.userId);
    
    if (!userData) {
      db.prepare('INSERT INTO user_data (user_id, favorites, achievements, quiz_progress, streak_count, streak_last_date, settings, local_storage_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
        req.userId,
        '[]',
        '[]',
        '{}',
        0,
        null,
        '{}',
        JSON.stringify(localData || {})
      );
      return res.json({ success: true, merged: false, data: localData || {} });
    }
    
    const dbFavorites = JSON.parse(userData.favorites || '[]');
    const dbAchievements = JSON.parse(userData.achievements || '[]');
    const dbQuizProgress = JSON.parse(userData.quiz_progress || '{}');
    const dbStreakCount = userData.streak_count || 0;
    
    const localFavorites = localData?.favorites || [];
    const localAchievements = localData?.achievements || [];
    const localQuizProgress = localData?.quizProgress || {};
    const localStreakCount = localData?.streakCount || 0;
    
    const mergedFavorites = [...new Set([...dbFavorites, ...localFavorites])];
    const mergedAchievements = [...new Set([...dbAchievements, ...localAchievements])];
    const mergedQuizProgress = { ...dbQuizProgress, ...localQuizProgress };
    const mergedStreakCount = Math.max(dbStreakCount, localStreakCount);
    
    db.prepare(`
      UPDATE user_data SET 
        favorites = ?,
        achievements = ?,
        quiz_progress = ?,
        streak_count = ?,
        local_storage_data = ?
      WHERE user_id = ?
    `).run(
      JSON.stringify(mergedFavorites),
      JSON.stringify(mergedAchievements),
      JSON.stringify(mergedQuizProgress),
      mergedStreakCount,
      JSON.stringify(localData || {}),
      req.userId
    );
    
    res.json({
      success: true,
      merged: true,
      data: {
        favorites: mergedFavorites,
        achievements: mergedAchievements,
        quizProgress: mergedQuizProgress,
        streakCount: mergedStreakCount
      }
    });
  } catch (error) {
    console.error('Merge local data error:', error);
    res.status(500).json({ error: 'Failed to merge local data' });
  }
});

function getUserPublicData(userId) {
  const user = db.prepare('SELECT id, email, created_at, last_login, plan, plan_expiry FROM users WHERE id = ?').get(userId);
  return user;
}

function logPaymentEvent({
  provider,
  eventType,
  status = 'info',
  orderId = null,
  amount = null,
  currency = null,
  userId = null,
  txnId = null,
  payload = null
}) {
  try {
    db.prepare(`
      INSERT INTO payment_events (provider, event_type, status, order_id, amount, currency, user_id, txn_id, payload)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      provider,
      eventType,
      status,
      orderId,
      amount,
      currency,
      userId,
      txnId,
      payload ? JSON.stringify(payload).slice(0, 10000) : null
    );
  } catch (error) {
    console.error('Payment event log failed:', error);
  }
}

function activateSubscription(userId, plan, amount, currency, txnId, paymobOrderId) {
  const planInfo = PLANS[plan];
  if (!planInfo) {
    throw new Error('Invalid plan');
  }

  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + planInfo.months);

  const existingSub = db.prepare('SELECT id FROM subscriptions WHERE user_id = ? AND status = ?').get(
    userId,
    'active'
  );

  if (existingSub) {
    db.prepare('UPDATE subscriptions SET status = ? WHERE id = ?').run('expired', existingSub.id);
  }

  db.prepare('UPDATE users SET plan = ?, plan_expiry = ?, subscription_txn_id = ? WHERE id = ?').run(
    plan,
    expiryDate.toISOString(),
    txnId || paymobOrderId,
    userId
  );

  db.prepare(`
    INSERT INTO subscriptions (user_id, plan, amount, currency, txn_id, paymob_order_id, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(userId, plan, amount, currency, txnId, paymobOrderId, expiryDate.toISOString());

  logPaymentEvent({
    provider: 'internal',
    eventType: 'subscription.activated',
    status: 'success',
    orderId: paymobOrderId || txnId,
    amount,
    currency,
    userId,
    txnId
  });

  return getUserPublicData(userId);
}

function normalizePaytabsPhone(phone) {
  if (!phone) return '';
  const trimmed = phone.trim();
  if (trimmed.startsWith('+')) return trimmed;
  if (trimmed.startsWith('00')) return `+${trimmed.slice(2)}`;
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (!digitsOnly) return trimmed;
  if (digitsOnly.startsWith('0')) {
    return `+20${digitsOnly.slice(1)}`;
  }
  return `+20${digitsOnly}`;
}

function parsePaytabsResult(payload) {
  const paymentResult = payload?.payment_result || {};
  const responseStatus = paymentResult.response_status || payload?.respStatus || payload?.response_status;
  const responseCode = paymentResult.response_code || payload?.respCode || payload?.response_code;
  const responseMessage = paymentResult.response_message || payload?.respMessage || payload?.response_message;
  const cartId = payload?.cart_id || payload?.cartId;
  const tranRef = payload?.tran_ref || payload?.tranRef;

  return {
    isSuccess: responseStatus === 'A',
    responseStatus,
    responseCode,
    responseMessage,
    cartId,
    tranRef
  };
}

function handlePaytabsResult(result) {
  if (!result.cartId) return null;
  const order = db.prepare('SELECT * FROM paytabs_orders WHERE cart_id = ?').get(result.cartId);
  if (!order) return null;

  if (order.status === 'pending') {
    const newStatus = result.isSuccess ? 'paid' : 'failed';
    db.prepare('UPDATE paytabs_orders SET status = ?, tran_ref = ? WHERE cart_id = ?').run(
      newStatus,
      result.tranRef || order.tran_ref,
      result.cartId
    );

    if (result.isSuccess && order.user_id) {
      activateSubscription(order.user_id, order.plan, order.amount, order.currency || 'USD', result.tranRef, null);
    }
  }

  logPaymentEvent({
    provider: 'paytabs',
    eventType: 'payment.result',
    status: result.isSuccess ? 'success' : 'failed',
    orderId: result.cartId,
    amount: order.amount,
    currency: order.currency || 'USD',
    userId: order.user_id,
    txnId: result.tranRef,
    payload: {
      responseStatus: result.responseStatus,
      responseCode: result.responseCode,
      responseMessage: result.responseMessage
    }
  });

  return order;
}

async function getAuthToken() {
  console.log('Getting Paymob auth token...');
  const response = await fetch(`${PAYMOB_BASE_URL}/api/auth/tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: PAYMOB_API_KEY })
  });
  const data = await response.json();
  console.log('Auth response:', JSON.stringify(data));
  if (!data.token) {
    throw new Error(`Auth failed: ${JSON.stringify(data)}`);
  }
  return data.token;
}

async function createPaymobOrder(token, amountCents, userData) {
  const merchantOrderId = `PEL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const orderData = {
    auth_token: token,
    delivery_needed: 'false',
    amount_cents: amountCents,
    currency: 'EGP',
    merchant_order_id: merchantOrderId,
    items: []
  };

  console.log('Creating order with token:', token?.substring(0, 20) + '...');

  const response = await fetch(`${PAYMOB_BASE_URL}/api/ecommerce/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  
  const data = await response.json();
  console.log('Order response:', JSON.stringify(data));
  return { orderId: data.id, merchantOrderId };
}

async function getPaymentKey(token, amountCents, orderId, userData, userEmail) {
  const paymentKeyData = {
    auth_token: token,
    amount_cents: amountCents,
    expiration: 3600,
    order_id: orderId,
    billing_data: {
      apartment: 'NA',
      email: userEmail,
      phone_number: userData.phone || '0123456789',
      first_name: (userData.name || 'User').split(' ')[0],
      last_name: (userData.name || 'User').split(' ').slice(1).join(' ') || 'NA',
      street: 'NA',
      building: 'NA',
      floor: 'NA',
      city: 'Cairo',
      state: 'Cairo',
      country: 'EG',
      postal_code: '12345'
    },
    currency: 'EGP',
    integration_id: parseInt(PAYMOB_INTEGRATION_ID),
    lock_order_when_paid: 'false'
  };

  console.log('Payment key request:', JSON.stringify(paymentKeyData, null, 2));

  const response = await fetch(`${PAYMOB_BASE_URL}/api/acceptance/payment_keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentKeyData)
  });
  
  const data = await response.json();
  console.log('Payment key response:', JSON.stringify(data));
  
  if (!data.token) {
    throw new Error(`Payment key failed: ${JSON.stringify(data)}`);
  }
  
  return data.token;
}

app.post('/api/paymob/create-order', async (req, res) => {
  try {
    const { plan, currency, user, token } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({ success: false, error: 'Invalid plan' });
    }

    if (currency !== 'EGP') {
      return res.status(400).json({ success: false, error: 'Only EGP currency supported' });
    }

    const planInfo = PLANS[plan];
    const amountCents = planInfo.amountEGP * 100;

    let userEmail = user?.email;
    let userId = null;
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        userId = decoded.userId;
        const dbUser = db.prepare('SELECT email FROM users WHERE id = ?').get(decoded.userId);
        if (dbUser) userEmail = dbUser.email;
      }
    }

    if (!userEmail) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    console.log(`Creating Paymob order for ${planInfo.name} - ${planInfo.amountEGP} EGP`);

    const authToken = await getAuthToken();
    const { orderId, merchantOrderId } = await createPaymobOrder(authToken, amountCents, user);
    const paymentKey = await getPaymentKey(authToken, amountCents, orderId, user, userEmail);

    console.log(`Order created successfully: ${merchantOrderId}`);
    logPaymentEvent({
      provider: 'paymob',
      eventType: 'order.created',
      status: 'success',
      orderId: merchantOrderId,
      amount: planInfo.amountEGP,
      currency: 'EGP',
      userId,
      payload: { paymobOrderId: orderId }
    });

    res.json({
      success: true,
      iframeToken: paymentKey,
      integrationId: PAYMOB_IFRAME_ID,
      orderId: merchantOrderId,
      amount: planInfo.amountEGP,
      paymobOrderId: orderId
    });

  } catch (error) {
    console.error('Paymob error:', error);
    logPaymentEvent({
      provider: 'paymob',
      eventType: 'order.created',
      status: 'failed',
      payload: { error: error.message }
    });
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/paymob/complete-subscription', authMiddleware, async (req, res) => {
  try {
    const { plan, amount, txnId, paymobOrderId } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const planInfo = PLANS[plan];
    const user = activateSubscription(
      req.userId,
      plan,
      planInfo.amountEGP,
      'EGP',
      txnId,
      paymobOrderId
    );
    logPaymentEvent({
      provider: 'paymob',
      eventType: 'subscription.completed',
      status: 'success',
      orderId: paymobOrderId || txnId,
      amount: planInfo.amountEGP,
      currency: 'EGP',
      userId: req.userId,
      txnId
    });
    res.json({ success: true, user });

  } catch (error) {
    console.error('Complete subscription error:', error);
    logPaymentEvent({
      provider: 'paymob',
      eventType: 'subscription.completed',
      status: 'failed',
      payload: { error: error.message, userId: req.userId }
    });
    res.status(500).json({ error: 'Failed to activate subscription' });
  }
});

app.post('/api/paytabs/create-payment', async (req, res) => {
  try {
    const { plan, currency, user, token } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({ success: false, error: 'Invalid plan' });
    }

    if (currency !== 'USD') {
      return res.status(400).json({ success: false, error: 'Only USD currency supported' });
    }

    if (!PAYTABS_PROFILE_ID || !PAYTABS_SERVER_KEY) {
      return res.status(500).json({ success: false, error: 'PayTabs is not configured' });
    }

    const name = user?.name?.trim();
    const email = user?.email?.trim();
    const phone = user?.phone?.trim();

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, error: 'Name, email, and phone are required' });
    }

    let userId = null;
    let userEmail = email;
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        userId = decoded.userId;
        const dbUser = db.prepare('SELECT email FROM users WHERE id = ?').get(decoded.userId);
        if (dbUser) userEmail = dbUser.email;
      }
    }

    const planInfo = PLANS[plan];
    const cartId = `PEL_USD_${plan}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const returnUrl = process.env.PAYTABS_RETURN_URL || `${baseUrl}/api/paytabs/return`;
    const callbackUrl = process.env.PAYTABS_CALLBACK_URL || `${baseUrl}/api/paytabs/callback`;

    db.prepare(`
      INSERT INTO paytabs_orders (cart_id, user_id, plan, amount, currency)
      VALUES (?, ?, ?, ?, ?)
    `).run(cartId, userId, plan, planInfo.amountUSD, 'USD');

    const payload = {
      profile_id: parseInt(PAYTABS_PROFILE_ID, 10),
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id: cartId,
      cart_currency: 'USD',
      cart_amount: planInfo.amountUSD,
      cart_description: `${planInfo.name} (USD)`,
      return: returnUrl,
      callback: callbackUrl,
      customer_details: {
        name,
        email: userEmail,
        phone: normalizePaytabsPhone(phone),
        street1: 'NA',
        city: 'Cairo',
        state: 'EG',
        country: 'EG',
        zip: '00000'
      }
    };

    const response = await fetch(`${PAYTABS_BASE_URL}/payment/request`, {
      method: 'POST',
      headers: {
        authorization: PAYTABS_SERVER_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!data.redirect_url) {
      throw new Error(data.message || data.response_message || 'Failed to create PayTabs payment');
    }

    logPaymentEvent({
      provider: 'paytabs',
      eventType: 'payment.requested',
      status: 'success',
      orderId: cartId,
      amount: planInfo.amountUSD,
      currency: 'USD',
      userId,
      payload: { tran_ref: data.tran_ref }
    });

    res.json({
      success: true,
      redirect_url: data.redirect_url,
      cart_id: cartId
    });
  } catch (error) {
    console.error('PayTabs create payment error:', error);
    logPaymentEvent({
      provider: 'paytabs',
      eventType: 'payment.requested',
      status: 'failed',
      payload: { error: error.message }
    });
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/paytabs/callback', (req, res) => {
  const result = parsePaytabsResult(req.body || {});
  handlePaytabsResult(result);
  res.json({ received: true });
});

app.post('/api/paytabs/return', (req, res) => {
  const result = parsePaytabsResult(req.body || {});
  const order = handlePaytabsResult(result);
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  const redirectUrl = new URL('/pricing.html', baseUrl);

  redirectUrl.searchParams.set('paytabs', result.isSuccess ? 'success' : 'failed');
  if (order?.plan) redirectUrl.searchParams.set('plan', order.plan);
  if (order?.amount) redirectUrl.searchParams.set('amount', order.amount);
  if (result.tranRef) redirectUrl.searchParams.set('tran_ref', result.tranRef);
  if (!result.isSuccess && result.responseCode) redirectUrl.searchParams.set('code', result.responseCode);

  res.redirect(303, redirectUrl.toString());
});

app.post('/api/paymob/webhook', express.json(), (req, res) => {
  const { type, data } = req.body;
  
  if (type === 'TRANSACTION' && data.success) {
    console.log('Payment successful:', {
      orderId: data.order,
      amount: data.amount_cents / 100,
      txn: data.id
    });
  }

  logPaymentEvent({
    provider: 'paymob',
    eventType: 'webhook.transaction',
    status: data?.success ? 'success' : 'failed',
    orderId: data?.order,
    amount: data?.amount_cents ? data.amount_cents / 100 : null,
    currency: data?.currency || 'EGP',
    txnId: data?.id,
    payload: { type, data }
  });
  
  res.json({ received: true });
});

app.get('/api/paymob/health', (req, res) => {
  res.json({ 
    status: 'ok',
    configured: !!(PAYMOB_API_KEY && PAYMOB_INTEGRATION_ID),
    mode: PAYMOB_API_KEY?.includes('test') ? 'test' : 'live'
  });
});

function isAdminRequest(req) {
  const adminToken = process.env.ADMIN_TOKEN;
  const token = req.query.token || req.headers['x-admin-token'];
  if (adminToken && token === adminToken) return true;

  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;
  const authHeader = req.headers.authorization || '';
  if (adminUser && adminPass && authHeader.startsWith('Basic ')) {
    try {
      const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf8');
      const [user, pass] = decoded.split(':');
      if (user === adminUser && pass === adminPass) return true;
    } catch (e) {
      return false;
    }
  }

  return false;
}

function requireAdmin(req, res) {
  if (isAdminRequest(req)) return true;
  res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
  res.status(403).send('Forbidden');
  return false;
}

app.get('/admin/payment-events', (req, res) => {
  if (!requireAdmin(req, res)) return;

  const events = db.prepare(`
    SELECT id, created_at, provider, event_type, status, order_id, amount, currency, user_id, txn_id
    FROM payment_events
    ORDER BY id DESC
    LIMIT 200
  `).all();

  const rows = events.map((e) => `
    <tr>
      <td>${e.id}</td>
      <td>${e.created_at}</td>
      <td>${e.provider}</td>
      <td>${e.event_type}</td>
      <td>${e.status}</td>
      <td>${e.order_id || ''}</td>
      <td>${e.amount ?? ''}</td>
      <td>${e.currency || ''}</td>
      <td>${e.user_id || ''}</td>
      <td>${e.txn_id || ''}</td>
    </tr>
  `).join('');

  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'");
  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Payment Events</title>
        <link rel="icon" href="/favicon.ico" />
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #0b111a; color: #e6eef7; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th, td { border-bottom: 1px solid #1c2633; padding: 8px; text-align: left; }
          th { position: sticky; top: 0; background: #111a26; }
          tr:hover { background: #121c29; }
        </style>
      </head>
      <body>
        <h1>Payment Events</h1>
        <p>Latest 200 events</p>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Time</th>
              <th>Provider</th>
              <th>Event</th>
              <th>Status</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>User ID</th>
              <th>Txn ID</th>
            </tr>
          </thead>
          <tbody>${rows || ''}</tbody>
        </table>
      </body>
    </html>
  `);
});

app.get('/admin/payment-events.json', (req, res) => {
  if (!requireAdmin(req, res)) return;

  const events = db.prepare(`
    SELECT id, created_at, provider, event_type, status, order_id, amount, currency, user_id, txn_id, payload
    FROM payment_events
    ORDER BY id DESC
    LIMIT 200
  `).all();

  res.json({ events });
});

app.get('/api/user/subscription', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT plan, plan_expiry FROM users WHERE id = ?').get(req.userId);
  
  if (!user || user.plan === 'free' || !user.plan_expiry) {
    return res.json({ subscribed: false, plan: 'free' });
  }

  const expiry = new Date(user.plan_expiry);
  const subscribed = expiry > new Date();

  res.json({
    subscribed,
    plan: subscribed ? user.plan : 'free',
    expiry: user.plan_expiry
  });
});

const startServer = async () => {
  app.use(express.static(path.join(__dirname)));
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  
  try {
    await initDatabase();
    await initDb();
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
  
  app.get('/api/db-test', async (req, res) => {
    try {
      const result = await db.prepare('SELECT 1 as test').get();
      res.json({ success: true, result });
    } catch (error) {
      res.json({ success: false, error: error.message, stack: error.stack });
    }
  });
  
  app.get('/api/debug', (req, res) => {
    res.json({ turso: isTurso, dbType: isTurso ? 'Turso' : 'sql.js' });
  });
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Physics Experiments Lab server running on port ${PORT}`);
    console.log(`Paymob mode: ${PAYMOB_API_KEY?.includes('test') ? 'TEST' : 'LIVE'}`);
    console.log(`Integration ID: ${PAYMOB_INTEGRATION_ID}`);
    console.log(`Database: ${isTurso ? 'Turso (cloud)' : 'sql.js (in-memory)'}`);
  });
};

startServer().catch(err => {
  console.error('Server failed to start:', err);
});
