const Auth = {
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'auth_user',

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  getUser() {
    try {
      const user = localStorage.getItem(this.USER_KEY);
      if (!user) return null;
      const parsed = JSON.parse(user);
      if (!parsed || typeof parsed !== 'object') return null;
      return parsed;
    } catch (e) {
      console.error('getUser error:', e);
      return null;
    }
  },

  setAuth(token, user, userData = null) {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      if (userData) {
        this.setLocalUserData(userData);
      }
      this.updateUI();
    } catch (e) {
      console.error('setAuth error:', e);
    }
  },

  clearAuth() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.updateUI();
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  isSubscribed() {
    const user = this.getUser();
    if (!user || user.plan === 'free') return false;
    if (!user.planExpiry) return false;
    return new Date(user.planExpiry) > new Date();
  },

  async signup(email, password, name = '') {
    try {
      console.log('Attempting signup for:', email);
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Signup failed');
      }
      
      localStorage.setItem(this.TOKEN_KEY, data.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
      this.updateUI();
      return { success: true, user: data.user, needsVerification: data.needsVerification };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  },

  async signin(email, password) {
    try {
      console.log('Attempting signin for:', email);
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Signin failed');
      }
      
      localStorage.setItem(this.TOKEN_KEY, data.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
      if (data.userData) {
        localStorage.setItem('user_data', JSON.stringify(data.userData));
      }
      this.updateUI();
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Signin error:', error);
      return { success: false, error: error.message };
    }
  },

  async verify() {
    const token = this.getToken();
    if (!token) return { valid: false };
    
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        this.clearAuth();
        return { valid: false };
      }
      
      const data = await response.json();
      const existing = this.getUser();
      if (existing?.avatar && !data.user?.avatar) {
        data.user.avatar = existing.avatar;
      }
      localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
      return { valid: true, user: data.user };
    } catch (error) {
      return { valid: false };
    }
  },

  async logout() {
    this.clearAuth();
  },

  async forgotPassword(email) {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      return { success: true, message: data.message };
    } catch (error) {
      return { success: true, message: 'If email exists, reset instructions will be sent' };
    }
  },

  async resetPassword(token, password) {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Reset failed');
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async sendVerificationEmail() {
    const token = this.getToken();
    if (!token) return { success: false, error: 'Not logged in' };
    
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      return { success: data.success, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getProfile() {
    const token = this.getToken();
    if (!token) return { success: false, error: 'Not logged in' };
    
    try {
      const response = await fetch('/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get profile');
      }
      
      return { success: true, profile: data.profile, userData: data.userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async updateProfile(updates) {
    const token = this.getToken();
    if (!token) return { success: false, error: 'Not logged in' };
    
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      
      if (data.profile) {
        const user = this.getUser();
        this.setAuth(token, { ...user, ...data.profile });
      }
      
      return { success: true, profile: data.profile };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async uploadAvatar(file) {
    return new Promise((resolve) => {
      const token = this.getToken();
      if (!token) return resolve({ success: false, error: 'Not logged in' });
      
      if (!file.type.startsWith('image/')) {
        return resolve({ success: false, error: 'Please select an image file' });
      }
      
      if (file.size > 5 * 1024 * 1024) {
        return resolve({ success: false, error: 'Image too large. Max 5MB' });
      }
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const imageData = e.target.result;
          const response = await fetch('/api/auth/avatar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ image: imageData })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            return resolve({ success: false, error: data.error || 'Upload failed' });
          }
          
          const user = this.getUser();
          user.avatar = data.avatar;
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          
          resolve({ success: true, avatar: data.avatar });
        } catch (error) {
          resolve({ success: false, error: error.message });
        }
      };
      reader.onerror = () => resolve({ success: false, error: 'Failed to read file' });
      reader.readAsDataURL(file);
    });
  },

  async deleteAvatar() {
    const token = this.getToken();
    if (!token) return { success: false, error: 'Not logged in' };
    
    try {
      const response = await fetch('/api/auth/avatar', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete avatar');
      }
      
      const user = this.getUser();
      delete user.avatar;
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getAvatarUrl(avatar) {
    if (!avatar) return null;
    return `/uploads/avatars/${avatar}`;
  },

  async changePassword(currentPassword, newPassword) {
    const token = this.getToken();
    if (!token) return { success: false, error: 'Not logged in' };
    
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async deleteAccount() {
    const token = this.getToken();
    if (!token) return { success: false, error: 'Not logged in' };
    
    try {
      const response = await fetch('/api/auth/account', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete account');
      }
      
      this.clearAuth();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async mergeLocalData() {
    const token = this.getToken();
    if (!token) return;
    
    try {
      const localData = this.getLocalUserData();
      if (!localData) return;
      
      const response = await fetch('/api/auth/merge-local-data', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ localData })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          this.setLocalUserData(data.data);
        }
      }
    } catch (error) {
      console.log('Local data merge skipped:', error.message);
    }
  },

  async syncUserData() {
    const token = this.getToken();
    if (!token) return;
    
    try {
      const localData = this.getLocalUserData();
      
      const response = await fetch('/api/auth/user-data', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          if (localData && Object.keys(localData).length > 0) {
            await this.mergeLocalData();
          } else {
            this.setLocalUserData(data.data);
          }
        }
      }
    } catch (error) {
      console.log('User data sync skipped:', error.message);
    }
  },

  getLocalUserData() {
    const data = localStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
  },

  setLocalUserData(data) {
    localStorage.setItem('user_data', JSON.stringify(data));
  },

  saveUserData(data) {
    this.setLocalUserData(data);
    this.syncUserData();
  },

  updateUI() {
    const user = this.getUser();
    const authBtn = document.getElementById('authBtn');
    const authDropdown = document.getElementById('authDropdown');
    
    if (!authBtn) return;
    
    if (!user) {
      authBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--accent);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span style="color:var(--accent);">Sign In</span>';
      authBtn.onclick = () => { if (typeof showAuthModal !== 'undefined') showAuthModal('signin'); };
      if (authDropdown) authDropdown.style.display = 'none';
      return;
    }
    
    const subscribed = this.isSubscribed();
    const avatarInitial = (user.name || user.email)[0].toUpperCase();
    const displayName = user.name || user.email.split('@')[0];
    const avatarUrl = user.avatar ? this.getAvatarUrl(user.avatar) : null;
    const baseItemStyle = 'display:flex;align-items:center;gap:10px;padding:10px 12px;color:var(--text);text-decoration:none;border-radius:10px;font-size:13px;transition:background 0.2s;background:none;border:none;width:100%;cursor:pointer;text-align:left;';
    
    if (user) {
      const avatarHTML = avatarUrl 
        ? `<img src="${avatarUrl}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;">` 
        : `<span style="width:24px;height:24px;background:var(--accent);color:#0a0a0f;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:12px;">${avatarInitial}</span>`;
      authBtn.innerHTML = `${avatarHTML}<span class="user-email" style="color:var(--text);">${displayName}</span>${subscribed ? '<span class="sub-badge" style="background:linear-gradient(135deg,#ffd700,#ff8c00);color:#0a0a0f;font-size:9px;font-weight:700;padding:2px 6px;border-radius:6px;margin-left:4px;">PRO</span>' : ''}`;
      
      if (authDropdown) {
        let dropdownHTML = '<div style="padding:12px;border-bottom:1px solid var(--border);margin-bottom:8px;"><div style="font-weight:500;color:var(--text);font-size:14px;word-break:break-all;">' + user.email + '</div><div style="font-size:12px;color:var(--muted);margin-top:4px;">' + (subscribed ? 'Pro Subscriber' : 'Free Plan') + '</div>';
        if (user.emailVerified === false) {
          dropdownHTML += '<div style="font-size:11px;color:#ffaa00;margin-top:6px;padding:4px 8px;background:rgba(255,170,0,0.15);border-radius:6px;">Email not verified</div>';
        }
        dropdownHTML += '</div>';
        dropdownHTML += '<a href="profile.html" class="auth-dropdown-item" style="' + baseItemStyle + '" id="myAccountBtn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--muted);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>My Account</a>';
        dropdownHTML += '<a href="achievements.html" class="auth-dropdown-item" style="' + baseItemStyle + '"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--muted);"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>Achievements</a>';
        dropdownHTML += '<a href="pricing.html" class="auth-dropdown-item" style="' + baseItemStyle + '"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--muted);"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' + (subscribed ? 'Manage Subscription' : 'Upgrade to Pro') + '</a>';
        dropdownHTML += '<button class="auth-dropdown-item" id="logoutBtn" style="' + baseItemStyle + '"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--muted);"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Sign Out</button>';
        authDropdown.innerHTML = dropdownHTML;
        
        document.getElementById('logoutBtn').addEventListener('click', () => {
          this.logout();
          window.location.reload();
        });
      }
    } else {
      authBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--accent);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span style="color:var(--accent);">Sign In</span>';
      authBtn.onclick = () => showAuthModal('signin');
      if (authDropdown) {
        authDropdown.style.display = 'none';
      }
    }
  },
  
  closeDropdown() {
    const authDropdown = document.getElementById('authDropdown');
    if (authDropdown) {
      authDropdown.classList.remove('show');
    }
  },

  requireAuth(callback, requireSubscription = false) {
    if (!this.isLoggedIn()) {
      this.showModal('signin');
      return false;
    }
    
    if (requireSubscription && !this.isSubscribed()) {
      window.location.href = 'pricing.html';
      return false;
    }
    
    if (callback) callback();
    return true;
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  if (Auth.isLoggedIn()) {
    const result = await Auth.verify();
    if (result.valid) {
      Auth.updateUI();
      Auth.syncUserData();
    }
  }
});
