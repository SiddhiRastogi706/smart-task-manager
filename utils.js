/**
 * Utility Functions
 */

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const taskDate = new Date(dateString);
  taskDate.setHours(0, 0, 0, 0);
  
  if (taskDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (taskDate.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
}

/**
 * Check if a date is overdue
 * @param {string} dueDate - ISO date string
 * @param {string} status - Task status
 * @returns {boolean} True if overdue
 */
function isOverdue(dueDate, status) {
  if (status === 'done') return false;
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return due < today;
}

/**
 * Get days until due date
 * @param {string} dueDate - ISO date string
 * @returns {number} Number of days
 */
function getDaysUntilDue(dueDate) {
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diff = due - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Show toast notification
 * @param {string} message - Toast message
 * @param {number} duration - Duration in ms (default 3000)
 */
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  toastMessage.textContent = message;
  toast.classList.add('visible');
  
  setTimeout(() => {
    toast.classList.remove('visible');
  }, duration);
}

/**
 * Priority sort order for custom sorting
 */
const PRIORITY_ORDER = {
  'high': 0,
  'medium': 1,
  'low': 2
};

/**
 * Compare tasks for sorting
 * @param {Object} a - Task A
 * @param {Object} b - Task B
 * @returns {number} Sort order
 */
function compareTasks(a, b) {
  // By priority (high to low)
  if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  }
  
  // By due date (earliest first)
  return new Date(a.dueDate) - new Date(b.dueDate);
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
