// ============================================
// ACHIEVEMENT BADGE SYSTEM
// ============================================

const ACHIEVEMENTS = {
  // STREAK BADGES
  streak: {
    name: "Streak Master",
    icon: "🔥",
    tiers: [
      { level: 1, name: "First Flame", desc: "3 day streak", threshold: 3, rarity: "bronze" },
      { level: 2, name: "On Fire", desc: "7 day streak", threshold: 7, rarity: "bronze" },
      { level: 3, name: "Blazing", desc: "14 day streak", threshold: 14, rarity: "silver" },
      { level: 4, name: "Inferno", desc: "30 day streak", threshold: 30, rarity: "gold" },
      { level: 5, name: "Phoenix Rising", desc: "60 day streak", threshold: 60, rarity: "diamond" },
      { level: 6, name: "Unstoppable", desc: "100 day streak", threshold: 100, rarity: "master" }
    ]
  },

  // QUESTIONS ANSWERED BADGES
  questions: {
    name: "Question Crusher",
    icon: "📝",
    tiers: [
      { level: 1, name: "First Steps", desc: "Answer 10 questions", threshold: 10, rarity: "bronze" },
      { level: 2, name: "Getting Started", desc: "Answer 50 questions", threshold: 50, rarity: "bronze" },
      { level: 3, name: "Student", desc: "Answer 100 questions", threshold: 100, rarity: "silver" },
      { level: 4, name: "Scholar", desc: "Answer 250 questions", threshold: 250, rarity: "silver" },
      { level: 5, name: "Academic", desc: "Answer 500 questions", threshold: 500, rarity: "gold" },
      { level: 6, name: "Professor", desc: "Answer 1000 questions", threshold: 1000, rarity: "diamond" },
      { level: 7, name: "Knowledge Master", desc: "Answer 2000 questions", threshold: 2000, rarity: "master" }
    ]
  },

  // PERFECT QUIZ BADGES
  perfect: {
    name: "Perfectionist",
    icon: "💯",
    tiers: [
      { level: 1, name: "First Perfect", desc: "100% on any quiz", threshold: 1, rarity: "bronze" },
      { level: 2, name: "Sharp Eye", desc: "5 perfect quizzes", threshold: 5, rarity: "silver" },
      { level: 3, name: "Precision", desc: "15 perfect quizzes", threshold: 15, rarity: "gold" },
      { level: 4, name: "Flawless", desc: "30 perfect quizzes", threshold: 30, rarity: "diamond" },
      { level: 5, name: "No Flaws", desc: "50 perfect quizzes", threshold: 50, rarity: "master" }
    ]
  },

  // ACCURACY BADGES (Average score)
  accuracy: {
    name: "Accuracy Expert",
    icon: "🎯",
    tiers: [
      { level: 1, name: "Aim True", desc: "70% average accuracy", threshold: 70, rarity: "bronze" },
      { level: 2, name: "Sharp Shooter", desc: "80% average accuracy", threshold: 80, rarity: "silver" },
      { level: 3, name: "Dead Eye", desc: "90% average accuracy", threshold: 90, rarity: "gold" },
      { level: 4, name: "Eagle Eye", desc: "95% average accuracy", threshold: 95, rarity: "diamond" },
      { level: 5, name: "Perfect Aim", desc: "99% average accuracy", threshold: 99, rarity: "master" }
    ]
  },

  // TOPICS MASTERED
  topics: {
    name: "Topic Master",
    icon: "📚",
    tiers: [
      { level: 1, name: "Explorer", desc: "Complete 3 topics", threshold: 3, rarity: "bronze" },
      { level: 2, name: "Learner", desc: "Complete 6 topics", threshold: 6, rarity: "bronze" },
      { level: 3, name: "Expert", desc: "Complete 10 topics", threshold: 10, rarity: "silver" },
      { level: 4, name: "Specialist", desc: "Complete 15 topics", threshold: 15, rarity: "gold" },
      { level: 5, name: "Renaissance", desc: "Complete all topics", threshold: 20, rarity: "diamond" }
    ]
  },

  // DAILY LOGIN BADGES
  logins: {
    name: "Dedicated Learner",
    icon: "🔑",
    tiers: [
      { level: 1, name: "First Visit", desc: "Complete first login", threshold: 1, rarity: "bronze" },
      { level: 2, name: "Regular", desc: "7 total logins", threshold: 7, rarity: "bronze" },
      { level: 3, name: "Committed", desc: "30 total logins", threshold: 30, rarity: "silver" },
      { level: 4, name: "Loyal", desc: "100 total logins", threshold: 100, rarity: "gold" },
      { level: 5, name: "Devoted", desc: "365 total logins", threshold: 365, rarity: "master" }
    ]
  },

  // TIME SPENT LEARNING
  timeSpent: {
    name: "Time Investor",
    icon: "⏰",
    tiers: [
      { level: 1, name: "Quick Study", desc: "30 minutes total", threshold: 30, rarity: "bronze" },
      { level: 2, name: "Focused", desc: "2 hours total", threshold: 120, rarity: "bronze" },
      { level: 3, name: "Dedicated", desc: "10 hours total", threshold: 600, rarity: "silver" },
      { level: 4, name: "Scholar", desc: "50 hours total", threshold: 3000, rarity: "gold" },
      { level: 5, name: "Lifetime Learner", desc: "100 hours total", threshold: 6000, rarity: "diamond" },
      { level: 6, name: "Eternal Student", desc: "500 hours total", threshold: 30000, rarity: "master" }
    ]
  },

  // SIMULATION EXPLORER
  simulations: {
    name: "Simulation Explorer",
    icon: "🔬",
    tiers: [
      { level: 1, name: "First Discovery", desc: "Use 5 simulations", threshold: 5, rarity: "bronze" },
      { level: 2, name: "Curious Mind", desc: "Use 20 simulations", threshold: 20, rarity: "silver" },
      { level: 3, name: "Experimenter", desc: "Use 50 simulations", threshold: 50, rarity: "gold" },
      { level: 4, name: "Scientist", desc: "Use 100 simulations", threshold: 100, rarity: "diamond" },
      { level: 5, name: "Master Explorer", desc: "Use all simulations", threshold: 150, rarity: "master" }
    ]
  },

  // SPEED QUIZ (Time-based achievements)
  speed: {
    name: "Speed Demon",
    icon: "⚡",
    tiers: [
      { level: 1, name: "Fast Start", desc: "Complete quiz under 1 min", threshold: 60, rarity: "bronze" },
      { level: 2, name: "Lightning", desc: "Complete quiz under 30 sec", threshold: 30, rarity: "silver" },
      { level: 3, name: "Flash", desc: "Complete quiz under 15 sec", threshold: 15, rarity: "gold" },
      { level: 4, name: "Quicksilver", desc: "Complete quiz under 10 sec", threshold: 10, rarity: "diamond" }
    ]
  },

  // COMBO BADGES (Consecutive correct answers)
  combo: {
    name: "Combo King",
    icon: "🔥",
    tiers: [
      { level: 1, name: "Hot Start", desc: "5 correct in a row", threshold: 5, rarity: "bronze" },
      { level: 2, name: "On Fire", desc: "10 correct in a row", threshold: 10, rarity: "silver" },
      { level: 3, name: "Unstoppable", desc: "20 correct in a row", threshold: 20, rarity: "gold" },
      { level: 4, name: "Legend", desc: "50 correct in a row", threshold: 50, rarity: "diamond" }
    ]
  },

  // FIRST QUIZ COMPLETION
  firstQuiz: {
    name: "First Steps",
    icon: "🏁",
    tiers: [
      { level: 1, name: "First Quiz", desc: "Complete your first quiz", threshold: 1, rarity: "bronze" }
    ]
  },

  // HARD QUESTIONS
  hardQuestions: {
    name: "Challenge Seeker",
    icon: "💪",
    tiers: [
      { level: 1, name: "Brave", desc: "Answer 10 hard questions", threshold: 10, rarity: "silver" },
      { level: 2, name: "Champion", desc: "Answer 50 hard questions", threshold: 50, rarity: "gold" },
      { level: 3, name: "Warrior", desc: "Answer 100 hard questions", threshold: 100, rarity: "diamond" },
      { level: 4, name: "Titan", desc: "Answer 250 hard questions", threshold: 250, rarity: "master" }
    ]
  },

  // EARLY BIRD (Quiz before 9 AM)
  earlyBird: {
    name: "Early Bird",
    icon: "🐦",
    tiers: [
      { level: 1, name: "Morning Person", desc: "Complete quiz before 9 AM", threshold: 1, rarity: "bronze" },
      { level: 2, name: "Dawn Learner", desc: "10 early quizzes", threshold: 10, rarity: "silver" },
      { level: 3, name: "Sunrise Scholar", desc: "50 early quizzes", threshold: 50, rarity: "gold" }
    ]
  },

  // NIGHT OWL (Quiz after 10 PM)
  nightOwl: {
    name: "Night Owl",
    icon: "🦉",
    tiers: [
      { level: 1, name: "Night Learner", desc: "Complete quiz after 10 PM", threshold: 1, rarity: "bronze" },
      { level: 2, name: "Midnight Scholar", desc: "10 late quizzes", threshold: 10, rarity: "silver" },
      { level: 3, name: "Dark Knight", desc: "50 late quizzes", threshold: 50, rarity: "gold" }
    ]
  },

  // WEEKEND WARRIOR
  weekend: {
    name: "Weekend Warrior",
    icon: "🎉",
    tiers: [
      { level: 1, name: "Party Starter", desc: "Complete quiz on weekend", threshold: 1, rarity: "bronze" },
      { level: 2, name: "Weekend Champ", desc: "10 weekend quizzes", threshold: 10, rarity: "silver" },
      { level: 3, name: "Weekend Legend", desc: "50 weekend quizzes", threshold: 50, rarity: "gold" }
    ]
  }
};

// SECRET BADGES (Hidden until earned)
const SECRET_BADGES = {
  comebackKid: {
    name: "Comeback Kid",
    icon: "🔄",
    desc: "Recover from a bad quiz streak",
    rarity: "gold",
    secret: true,
    check: (stats) => stats.worstStreak >= 3 && stats.recoveredFromBadStreak
  },
  nightShift: {
    name: "Night Shift",
    icon: "🌙",
    desc: "Study after midnight",
    rarity: "silver",
    secret: true,
    check: (stats) => stats.midnightSessions >= 3
  },
  speedDemon: {
    name: "Speed Demon",
    icon: "💨",
    desc: "Answer 10 questions in under 60 seconds",
    rarity: "gold",
    secret: true,
    check: (stats) => stats.fastest10Time && stats.fastest10Time < 60
  },
  perfectionist: {
    name: "Perfectionist",
    icon: "✨",
    desc: "Get 100% on hard difficulty quiz",
    rarity: "diamond",
    secret: true,
    check: (stats) => stats.perfectHardQuizzes >= 1
  },
  marathon: {
    name: "Marathon",
    icon: "🏃",
    desc: "Complete 50 questions in one session",
    rarity: "gold",
    secret: true,
    check: (stats) => stats.maxSessionQuestions >= 50
  },
  socialButterfly: {
    name: "Social Butterfly",
    icon: "🦋",
    desc: "Share your results",
    rarity: "bronze",
    secret: true,
    check: (stats) => stats.timesShared >= 1
  },
  collector: {
    name: "Collector",
    icon: "🗃️",
    desc: "Use all difficulty levels",
    rarity: "silver",
    secret: true,
    check: (stats) => stats.difficultiesUsed >= 3
  },
  allModes: {
    name: "Jack of All Trades",
    icon: "🎭",
    desc: "Try all quiz modes",
    rarity: "gold",
    secret: true,
    check: (stats) => stats.modesUsed >= 4
  },
  nightShift100: {
    name: "Insomniac",
    icon: "😴",
    desc: "Complete 100 late-night study sessions",
    rarity: "master",
    secret: true,
    check: (stats) => stats.midnightSessions >= 100
  },
  thousandCorrect: {
    name: "Century",
    icon: "💯",
    desc: "1000 correct answers in a row (cumulative)",
    rarity: "master",
    secret: true,
    check: (stats) => stats.totalCorrect >= 1000
  }
};

// RARITY COLORS
const RARITY_COLORS = {
  bronze: { bg: '#cd7f32', glow: 'rgba(205, 127, 50, 0.5)', text: '#fff' },
  silver: { bg: '#c0c0c0', glow: 'rgba(192, 192, 192, 0.5)', text: '#333' },
  gold: { bg: '#ffd700', glow: 'rgba(255, 215, 0, 0.5)', text: '#333' },
  diamond: { bg: '#b9f2ff', glow: 'rgba(185, 242, 255, 0.6)', text: '#006994' },
  master: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', glow: 'rgba(118, 75, 162, 0.6)', text: '#fff' }
};

// ============================================
// USER STATS TRACKING
// ============================================

const UserStats = {
  KEY: 'physics_sim_stats',

  getDefault() {
    return {
      // Counts
      totalQuestionsAnswered: 0,
      totalCorrect: 0,
      totalQuizzesCompleted: 0,
      perfectQuizzes: 0,
      topicsCompleted: 0,
      topicsCompletedList: [],
      simulationsUsed: 0,
      simulationsUsedList: [],
      totalLogins: 0,
      totalMinutesSpent: 0,
      hardQuestionsAnswered: 0,
      hardQuestionsCorrect: 0,

      // Streaks
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      worstStreak: 0,
      recoveredFromBadStreak: false,

      // Speed stats
      fastestQuizTime: null,
      fastest10Time: null,

      // Session stats
      maxSessionQuestions: 0,
      currentSessionQuestions: 0,
      currentCombo: 0,
      longestCombo: 0,

      // Time-based
      earlyQuizzes: 0,
      lateQuizzes: 0,
      midnightSessions: 0,
      weekendQuizzes: 0,

      // Misc
      difficultiesUsed: new Set(),
      modesUsed: new Set(),
      timesShared: 0,

      // Badges
      earnedBadges: [],
      claimedBadges: [],
      pendingBadges: [],

      // Trackers for edge cases
      quizHistory: [],
      dailyMinutes: {},
      dailyCorrect: {}
    };
  },

  load() {
    try {
      const data = localStorage.getItem(this.KEY);
      if (data) {
        const stats = JSON.parse(data);
        // Ensure Set-like properties are arrays for storage
        if (typeof stats.difficultiesUsed === 'string') {
          stats.difficultiesUsed = [stats.difficultiesUsed];
        }
        if (typeof stats.modesUsed === 'string') {
          stats.modesUsed = [stats.modesUsed];
        }
        return stats;
      }
    } catch (e) {
      console.error('Error loading stats:', e);
    }
    return this.getDefault();
  },

  save(stats) {
    try {
      // Convert Sets to arrays for storage
      const toSave = {
        ...stats,
        difficultiesUsed: Array.from(stats.difficultiesUsed || []),
        modesUsed: Array.from(stats.modesUsed || [])
      };
      localStorage.setItem(this.KEY, JSON.stringify(toSave));
      
      // Sync with backend if user is logged in
      if (typeof Auth !== 'undefined' && Auth.isLoggedIn()) {
        const userData = {
          achievements: stats.earnedBadges || [],
          quizProgress: {
            questionsAnswered: stats.questionsAnswered || 0,
            correctAnswers: stats.correctAnswers || 0,
            quizzesCompleted: stats.quizzesCompleted || 0,
            perfectQuizzes: stats.perfectQuizzes || 0,
            totalScore: stats.totalScore || 0
          },
          streakCount: stats.currentStreak || 0,
          streakLastDate: stats.lastActivityDate || null
        };
        Auth.saveUserData(userData);
      }
    } catch (e) {
      console.error('Error saving stats:', e);
    }
  },

  update(updater) {
    const stats = this.load();
    updater(stats);
    this.save(stats);
    return stats;
  }
};

// ============================================
// ACHIEVEMENT TRACKER
// ============================================

const AchievementTracker = {
  pendingNotifications: [],

  init() {
    this.checkDailyLogin();
    this.checkAchievements();
    this.startSessionTimer();
    this.updateStreak();
  },

  // Check and update daily login streak
  checkDailyLogin() {
    UserStats.update(stats => {
      const today = new Date().toDateString();
      
      if (stats.lastActiveDate === today) {
        return; // Already active today
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (stats.lastActiveDate === yesterdayStr) {
        // Consecutive day - increment streak
        stats.currentStreak++;
        
        // Track recovery from bad streak
        if (stats.worstStreak >= 3 && stats.currentStreak > stats.worstStreak) {
          stats.recoveredFromBadStreak = true;
        }
      } else if (stats.lastActiveDate !== today) {
        // Streak broken - start new
        if (stats.currentStreak > 0 && stats.currentStreak < stats.worstStreak) {
          stats.worstStreak = stats.currentStreak;
        }
        stats.currentStreak = 1;
      }

      stats.lastActiveDate = today;
      stats.totalLogins++;

      // Check for midnight/early/late quiz
      const hour = new Date().getHours();
      if (hour === 0 || hour === 23) {
        stats.midnightSessions++;
      } else if (hour < 9) {
        stats.earlyQuizzes++;
      } else if (hour >= 22) {
        stats.lateQuizzes++;
      }

      // Weekend check
      const day = new Date().getDay();
      if (day === 0 || day === 6) {
        stats.weekendQuizzes++;
      }
    });
  },

  // Update streak on load
  updateStreak() {
    UserStats.update(stats => {
      const today = new Date().toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (stats.lastActiveDate !== today && stats.lastActiveDate !== yesterdayStr) {
        // Streak broken while away
        if (stats.currentStreak > stats.worstStreak) {
          stats.worstStreak = stats.currentStreak;
        }
        stats.currentStreak = 0;
      }
    });
  },

  // Track time spent
  startSessionTimer() {
    const startTime = Date.now();
    
    setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 60000); // minutes
      UserStats.update(stats => {
        stats.totalMinutesSpent += elapsed;
        const today = new Date().toDateString();
        stats.dailyMinutes[today] = (stats.dailyMinutes[today] || 0) + elapsed;
      });
    }, 60000); // Update every minute
  },

  // Record quiz completion
  onQuizComplete(quizData) {
    const { questionsAnswered, correctAnswers, timeSeconds, difficulty, mode, questions } = quizData;

    UserStats.update(stats => {
      // Update counts
      stats.totalQuestionsAnswered += questionsAnswered;
      stats.totalCorrect += correctAnswers;
      stats.totalQuizzesCompleted++;
      stats.currentSessionQuestions += questionsAnswered;
      
      // Update max session
      if (stats.currentSessionQuestions > stats.maxSessionQuestions) {
        stats.maxSessionQuestions = stats.currentSessionQuestions;
      }

      // Track difficulty
      if (difficulty) {
        stats.difficultiesUsed.add(difficulty);
      }

      // Track mode
      if (mode) {
        stats.modesUsed.add(mode);
      }

      // Track fast completions
      if (timeSeconds && stats.fastestQuizTime === null || timeSeconds < stats.fastestQuizTime) {
        stats.fastestQuizTime = timeSeconds;
      }

      // Calculate combo (longest streak of correct in this quiz)
      let currentCombo = 0;
      let maxCombo = 0;
      questions.forEach(q => {
        if (q.userAnswer === q.answer) {
          currentCombo++;
          maxCombo = Math.max(maxCombo, currentCombo);
        } else {
          currentCombo = 0;
        }
      });
      
      if (maxCombo > stats.longestCombo) {
        stats.longestCombo = maxCombo;
      }

      // Track hard questions
      const hardQuestions = questions.filter(q => q.difficulty === 'Hard');
      stats.hardQuestionsAnswered += hardQuestions.length;
      stats.hardQuestionsCorrect += hardQuestions.filter(q => q.userAnswer === q.answer).length;

      // Check for perfect quiz
      if (correctAnswers === questionsAnswered) {
        stats.perfectQuizzes++;
        if (difficulty === 'Hard') {
          stats.perfectHardQuizzes = (stats.perfectHardQuizzes || 0) + 1;
        }
      }

      // Time-based tracking
      const hour = new Date().getHours();
      if (hour === 0 || hour === 23) {
        stats.midnightSessions++;
      } else if (hour < 9) {
        stats.earlyQuizzes++;
      } else if (hour >= 22) {
        stats.lateQuizzes++;
      }

      // Weekend
      const day = new Date().getDay();
      if (day === 0 || day === 6) {
        stats.weekendQuizzes++;
      }

      // Record in history
      stats.quizHistory.push({
        date: new Date().toISOString(),
        score: correctAnswers / questionsAnswered * 100,
        difficulty,
        mode
      });

      // Keep only last 100 quizzes
      if (stats.quizHistory.length > 100) {
        stats.quizHistory = stats.quizHistory.slice(-100);
      }
    });

    // Check achievements
    this.checkAchievements();
  },

  // Record simulation usage
  onSimulationUsed(simulationId) {
    UserStats.update(stats => {
      if (!stats.simulationsUsedList.includes(simulationId)) {
        stats.simulationsUsedList.push(simulationId);
        stats.simulationsUsed = stats.simulationsUsedList.length;
      }
    });
    this.checkAchievements();
  },

  // Record topic completion
  onTopicCompleted(topicId) {
    UserStats.update(stats => {
      if (!stats.topicsCompletedList.includes(topicId)) {
        stats.topicsCompletedList.push(topicId);
        stats.topicsCompleted = stats.topicsCompletedList.length;
      }
    });
    this.checkAchievements();
  },

  // Record share
  onShare() {
    UserStats.update(stats => {
      stats.timesShared++;
    });
    this.checkAchievements();
  },

  // Calculate average accuracy
  getAverageAccuracy() {
    const stats = UserStats.load();
    if (stats.totalQuestionsAnswered === 0) return 0;
    return Math.round((stats.totalCorrect / stats.totalQuestionsAnswered) * 100);
  },

  // Check all achievements
  checkAchievements() {
    const stats = UserStats.load();
    const newBadges = [];

    // Check tiered achievements
    for (const [category, achievement] of Object.entries(ACHIEVEMENTS)) {
      const statKey = this.getStatKey(category);
      
      for (const tier of achievement.tiers) {
        const badgeId = `${category}_${tier.level}`;
        const currentValue = this.getStatValue(stats, statKey);
        const threshold = tier.threshold;

        if (currentValue >= threshold && !stats.earnedBadges.includes(badgeId)) {
          stats.earnedBadges.push(badgeId);
          stats.pendingBadges.push({
            id: badgeId,
            icon: achievement.icon,
            name: tier.name,
            desc: tier.desc,
            rarity: tier.rarity,
            secret: false
          });
          newBadges.push(badgeId);
        }
      }
    }

    // Check secret achievements
    for (const [secretId, secretBadge] of Object.entries(SECRET_BADGES)) {
      if (!stats.earnedBadges.includes(secretId) && secretBadge.check(stats)) {
        stats.earnedBadges.push(secretId);
        stats.pendingBadges.push({
          id: secretId,
          icon: secretBadge.icon,
          name: secretBadge.name,
          desc: secretBadge.desc,
          rarity: secretBadge.rarity,
          secret: true
        });
        newBadges.push(secretId);
      }
    }

    if (newBadges.length > 0) {
      UserStats.save(stats);
    }

    return newBadges;
  },

  getStatKey(category) {
    const mapping = {
      streak: 'currentStreak',
      questions: 'totalQuestionsAnswered',
      perfect: 'perfectQuizzes',
      accuracy: 'averageAccuracy',
      topics: 'topicsCompleted',
      logins: 'totalLogins',
      timeSpent: 'totalMinutesSpent',
      simulations: 'simulationsUsed',
      speed: 'fastestQuizTime',
      combo: 'longestCombo',
      firstQuiz: 'totalQuizzesCompleted',
      hardQuestions: 'hardQuestionsAnswered',
      earlyBird: 'earlyQuizzes',
      nightOwl: 'lateQuizzes',
      weekend: 'weekendQuizzes'
    };
    return mapping[category] || category;
  },

  getStatValue(stats, key) {
    if (key === 'averageAccuracy') {
      return this.getAverageAccuracy();
    }
    return stats[key] || 0;
  },

  // Get pending badges (for notification)
  getPendingBadges() {
    const stats = UserStats.load();
    return stats.pendingBadges || [];
  },

  // Claim a badge
  claimBadge(badgeId) {
    UserStats.update(stats => {
      stats.claimedBadges.push(badgeId);
      stats.pendingBadges = stats.pendingBadges.filter(b => b.id !== badgeId);
    });
  },

  // Get all earned badges with details
  getEarnedBadges() {
    const stats = UserStats.load();
    const badges = [];

    for (const badgeId of stats.earnedBadges) {
      const badge = this.getBadgeDetails(badgeId);
      if (badge) {
        badge.claimed = stats.claimedBadges.includes(badgeId);
        badges.push(badge);
      }
    }

    return badges;
  },

  // Get badge details by ID
  getBadgeDetails(badgeId) {
    // Check tiered achievements
    for (const [category, achievement] of Object.entries(ACHIEVEMENTS)) {
      for (const tier of achievement.tiers) {
        if (`${category}_${tier.level}` === badgeId) {
          return {
            id: badgeId,
            icon: achievement.icon,
            name: tier.name,
            category: achievement.name,
            desc: tier.desc,
            rarity: tier.rarity,
            secret: false
          };
        }
      }
    }

    // Check secret achievements
    for (const [secretId, secretBadge] of Object.entries(SECRET_BADGES)) {
      if (secretId === badgeId) {
        return {
          id: secretId,
          icon: secretBadge.icon,
          name: '???',
          category: 'Secret',
          desc: '???',
          rarity: secretBadge.rarity,
          secret: true
        };
      }
    }

    return null;
  },

  // Get all badges (earned and unearned) for display
  getAllBadgesWithStatus() {
    const stats = UserStats.load();
    const allBadges = [];

    // Tiered badges - make locked badges mysterious
    for (const [category, achievement] of Object.entries(ACHIEVEMENTS)) {
      const statKey = this.getStatKey(category);
      const currentValue = this.getStatValue(stats, statKey);

      for (const tier of achievement.tiers) {
        const badgeId = `${category}_${tier.level}`;
        const earned = stats.earnedBadges.includes(badgeId);
        const claimed = stats.claimedBadges.includes(badgeId);

        // Calculate progress (only show if earned)
        const prevThreshold = achievement.tiers[tier.level - 2]?.threshold || 0;
        const progress = Math.min(100, Math.max(0, 
          ((currentValue - prevThreshold) / (tier.threshold - prevThreshold)) * 100
        ));

        allBadges.push({
          id: badgeId,
          icon: earned ? achievement.icon : '✨', // Mystery sparkle for locked
          name: earned ? tier.name : '???', // Always hide name when locked
          category: earned ? achievement.name : '???', // Hide category when locked
          desc: earned ? tier.desc : 'Keep learning to unlock this achievement', // Generic locked message
          rarity: tier.rarity,
          earned,
          claimed,
          progress: earned ? 100 : progress,
          threshold: earned ? tier.threshold : '???', // Hide threshold when locked
          current: earned ? Math.min(currentValue, tier.threshold) : null // Hide current when locked
        });
      }
    }

    // Secret badges - always mysterious until earned
    for (const [secretId, secretBadge] of Object.entries(SECRET_BADGES)) {
      const earned = stats.earnedBadges.includes(secretId);
      const claimed = stats.claimedBadges.includes(secretId);

      allBadges.push({
        id: secretId,
        icon: earned ? secretBadge.icon : '🔮', // Mystery orb for locked
        name: earned ? secretBadge.name : '???',
        category: 'Secret',
        desc: earned ? secretBadge.desc : 'A mysterious achievement awaits...',
        rarity: secretBadge.rarity,
        earned,
        claimed,
        progress: earned ? 100 : 0,
        threshold: '???',
        current: null
      });
    }

    return allBadges;
  },

  // Get badge counts by rarity
  getBadgeCounts() {
    const allBadges = this.getAllBadgesWithStatus();
    const counts = {
      total: allBadges.filter(b => b.earned).length,
      totalPossible: allBadges.length,
      byRarity: {}
    };

    for (const badge of allBadges) {
      if (badge.earned) {
        counts.byRarity[badge.rarity] = (counts.byRarity[badge.rarity] || 0) + 1;
      }
    }

    return counts;
  }
};

// ============================================
// BADGE UI COMPONENTS
// ============================================

const BadgeUI = {
  // Create badge HTML element
  createBadgeElement(badge, small = false, showAll = false) {
    const colors = RARITY_COLORS[badge.rarity];
    const size = small ? 'badge-small' : '';
    const isLocked = !badge.earned;
    const isHidden = isLocked && !showAll;
    
    return `
      <div class="achievement-badge ${size} ${badge.rarity} ${isLocked ? 'locked' : 'earned'} ${isHidden ? 'hidden' : ''}" 
           data-badge-id="${badge.id}"
           data-rarity="${badge.rarity}">
        <div class="badge-icon ${isLocked && !showAll ? 'locked-icon' : ''}">${badge.icon}</div>
        ${isLocked ? `<div class="badge-mystery-hint">${this.getRarityHint(badge.rarity)}</div>` : ''}
        ${!small ? `<div class="badge-info ${isHidden ? 'hidden-content' : ''}">
          <span class="badge-name">${badge.name}</span>
          ${badge.category !== '???' ? `<span class="badge-category">${badge.category}</span>` : ''}
          <span class="badge-desc">${badge.desc}</span>
        </div>` : ''}
        ${badge.earned && !badge.claimed ? '<div class="badge-new">NEW!</div>' : ''}
      </div>
    `;
  },

  // Get rarity hint for locked badges
  getRarityHint(rarity) {
    const hints = {
      bronze: 'Common',
      silver: 'Rare',
      gold: 'Epic',
      diamond: 'Legendary',
      master: 'Master'
    };
    return hints[rarity] || '???';
  },

  // Create notification modal
  createNotificationModal(badge) {
    const colors = RARITY_COLORS[badge.rarity];
    
    return `
      <div class="badge-notification-overlay" id="badgeNotification">
        <div class="badge-notification ${badge.rarity}">
          <div class="notification-badge-icon">${badge.icon}</div>
          <div class="notification-content">
            <h3 class="notification-title">Badge Unlocked!</h3>
            <div class="notification-name">${badge.name}</div>
            <div class="notification-desc">${badge.desc}</div>
            <div class="notification-rarity ${badge.rarity}">${badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}</div>
          </div>
          <button class="notification-claim-btn" onclick="BadgeUI.claimBadge('${badge.id}')">
            Claim Badge
          </button>
        </div>
      </div>
    `;
  },

  // Show badge notification
  showNotification(badge) {
    // Remove existing notification
    const existing = document.getElementById('badgeNotification');
    if (existing) existing.remove();

    // Create and show notification
    const overlay = document.createElement('div');
    overlay.innerHTML = this.createNotificationModal(badge);
    document.body.appendChild(overlay.firstElementChild);

    // Animate in
    const modal = document.getElementById('badgeNotification');
    modal.style.animation = 'badgePopIn 0.5s ease-out';

    // Auto-dismiss after 10 seconds if not claimed
    setTimeout(() => {
      if (document.getElementById('badgeNotification')) {
        modal.style.animation = 'badgePopOut 0.3s ease-in';
        setTimeout(() => modal.remove(), 300);
      }
    }, 10000);
  },

  // Claim badge
  claimBadge(badgeId) {
    AchievementTracker.claimBadge(badgeId);
    
    const modal = document.getElementById('badgeNotification');
    if (modal) {
      modal.style.animation = 'badgePopOut 0.3s ease-in';
      setTimeout(() => modal.remove(), 300);
    }

    // Update header badge count
    updateHeaderBadgeCount();
  },

  // Update header badge icon
  updateHeaderBadgeIcon() {
    const counts = AchievementTracker.getBadgeCounts();
    const header = document.querySelector('.header-actions') || document.querySelector('.site-header');
    if (!header) return;

    const existing = Array.from(document.querySelectorAll('.achievements-trigger'));
    if (existing.length > 1) {
      existing.slice(1).forEach(el => el.remove());
    }

    let badgeIcon = header.querySelector('.achievements-trigger') || document.getElementById('achievementsBtn');
    if (!badgeIcon) {
      return;
    }

    badgeIcon.className = 'achievements-trigger';
    badgeIcon.innerHTML = '🏆 <span class="badge-count">0</span>';
    badgeIcon.onclick = () => this.toggleDropdown();

    const count = badgeIcon.querySelector('.badge-count');
    if (count) {
      const pending = AchievementTracker.getPendingBadges().length;
      count.textContent = counts.total;
      if (pending > 0) {
        count.classList.add('has-new');
      }
    }
  },

  // Toggle dropdown
  toggleDropdown() {
    const dropdown = document.getElementById('achievementsDropdown');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  },

  // Show all achievements dropdown
  showDropdown() {
    let dropdown = document.getElementById('achievementsDropdown');
    
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.id = 'achievementsDropdown';
      dropdown.className = 'achievements-dropdown';
      document.body.appendChild(dropdown);
    }

    const badges = AchievementTracker.getAllBadgesWithStatus();
    const counts = AchievementTracker.getBadgeCounts();
    const showAll = localStorage.getItem('achievementsShowAll') === 'true';

    dropdown.innerHTML = `
      <div class="dropdown-header">
        <h3>🏆 Achievements</h3>
        <div class="dropdown-header-right">
          <span class="badge-count-display">${counts.total}/${counts.totalPossible}</span>
          <label class="show-all-toggle">
            <input type="checkbox" id="showAllToggle" ${showAll ? 'checked' : ''} />
            <span>Show All</span>
          </label>
        </div>
      </div>
      <div class="dropdown-stats">
        ${Object.entries(counts.byRarity).map(([rarity, count]) => `
          <span class="stat-pill ${rarity}">${count} ${rarity}</span>
        `).join('')}
      </div>
      <div class="dropdown-badges ${showAll ? 'show-all-mode' : ''}">
        ${badges.map(b => this.createBadgeElement(b, true, showAll)).join('')}
      </div>
      <div class="dropdown-footer">
        <a href="achievements.html">View All →</a>
      </div>
    `;

    // Add toggle event listener
    const toggle = document.getElementById('showAllToggle');
    if (toggle) {
      toggle.addEventListener('change', (e) => {
        const showAllMode = e.target.checked;
        localStorage.setItem('achievementsShowAll', showAllMode);
        const badgesContainer = dropdown.querySelector('.dropdown-badges');
        badgesContainer.classList.toggle('show-all-mode', showAllMode);
        // Re-render badges
        const allBadges = AchievementTracker.getAllBadgesWithStatus();
        badgesContainer.innerHTML = allBadges.map(b => this.createBadgeElement(b, true, showAllMode)).join('');
      });
    }

    dropdown.classList.add('show');
    
    // Position dropdown
    const trigger = document.querySelector('.achievements-trigger');
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      dropdown.style.top = (rect.bottom + 10) + 'px';
      dropdown.style.right = (window.innerWidth - rect.right) + 'px';
    }
  }
};

// Helper function for header
function updateHeaderBadgeCount() {
  BadgeUI.updateHeaderBadgeIcon();
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('achievementsDropdown');
  const trigger = document.querySelector('.achievements-trigger');
  
  if (dropdown && trigger && !dropdown.contains(e.target) && !trigger.contains(e.target)) {
    dropdown.classList.remove('show');
  }
});

// Export for use in other files immediately
window.AchievementTracker = AchievementTracker;
window.BadgeUI = BadgeUI;
window.ACHIEVEMENTS = ACHIEVEMENTS;
window.SECRET_BADGES = SECRET_BADGES;
window.RARITY_COLORS = RARITY_COLORS;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  AchievementTracker.init();
  BadgeUI.updateHeaderBadgeIcon();
  
  // Ensure button is clickable
  const btn = document.getElementById('achievementsBtn') || document.querySelector('.achievements-trigger');
  if (btn && !btn.onclick) {
    btn.onclick = () => BadgeUI.showDropdown();
  }
  
  // Global click fallback
  document.addEventListener('click', (e) => {
    if (e.target.closest('.achievements-trigger')) {
      BadgeUI.showDropdown();
    }
  });
  
  // Check for pending badges and show notification
  const pending = AchievementTracker.getPendingBadges();
  if (pending.length > 0) {
    BadgeUI.showNotification(pending[0]);
  }
});
