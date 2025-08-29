// App constants and configuration

// XP and Leveling
export const XP_PER_LEVEL = 100;
export const MAX_LEVEL = 100;

// Attribute colors for the circular displays
export const ATTRIBUTE_COLORS = {
  spirituality: '#a78bfa',    // Purple
  mindset: '#34d399',         // Green
  charisma: '#fbbf24',        // Yellow
  healthAndWellness: '#60a5fa', // Blue
  education: '#f87171'        // Red
};

// Attribute icons
export const ATTRIBUTE_ICONS = {
  spirituality: '🧘',
  mindset: '🧠',
  charisma: '💬',
  healthAndWellness: '🏃‍♂️',
  education: '📚'
};

// Default quests
export const DEFAULT_QUESTS = [
  { id: 1, text: "🧠 Read 30 mins", xp: 20, stats: { mindset: 1, healthAndWellness: 2 } },
  { id: 2, text: "🏋️ Workout", xp: 25, stats: { mindset: 1, healthAndWellness: 2 } },
  { id: 3, text: "📈 Study coding 1hr", xp: 30, stats: { mindset: 1, healthAndWellness: 2 } },
  { id: 4, text: "🤝 Network with 1 person", xp: 25, stats: { mindset: 1, healthAndWellness: 2 } },
];

// Default stats
export const DEFAULT_STATS = {
  spirituality: 0,
  mindset: 0,
  charisma: 0,
  healthAndWellness: 0,
  education: 0,
};

// Goal types
export const GOAL_TYPES = {
  HABIT: 'habit',
  MATERIAL: 'material'
};

// Goal frequencies
export const GOAL_FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

// Firebase collection names
export const COLLECTIONS = {
  USERS: 'users',
  GOALS: 'goals',
  QUESTS: 'quests'
};

// Local storage keys
export const STORAGE_KEYS = {
  XP: 'xp',
  LEVEL: 'level',
  STATS: 'stats',
  QUESTS: 'quests',
  COMPLETED_QUESTS: 'completedQuests',
  HABIT_GOALS: 'habitGoals',
  MATERIAL_GOALS: 'materialGoals'
};

// App routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  GOALS: '/goals'
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE: 1280
};

// Animation durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_ERROR: 'Authentication error. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  GOAL_ADDED: 'Goal added successfully!',
  GOAL_DELETED: 'Goal deleted successfully!',
  QUEST_COMPLETED: 'Quest completed! +{xp} XP',
  LEVEL_UP: 'Level up! You are now level {level}!'
}; 