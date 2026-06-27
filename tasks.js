/**
 * Task Management Module
 * Handles all task data operations
 */

class TaskManager {
  constructor() {
    this.tasks = [];
    this.loadTasks();
  }

  /**
   * Load tasks from localStorage
   */
  loadTasks() {
    const stored = localStorage.getItem('tasks');
    this.tasks = stored ? JSON.parse(stored) : [];
  }

  /**
   * Save tasks to localStorage
   */
  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  /**
   * Add a new task
   * @param {Object} taskData - Task data
   * @returns {Object} Created task
   */
  addTask(taskData) {
    const task = {
      id: generateId(),
      title: taskData.title.trim(),
      keywords: taskData.keywords.trim(),
      priority: taskData.priority,
      status: taskData.status,
      dueDate: taskData.dueDate,
      createdAt: new Date().toISOString()
    };

    this.tasks.push(task);
    this.saveTasks();
    return task;
  }

  /**
   * Update a task
   * @param {string} taskId - Task ID
   * @param {Object} updates - Fields to update
   * @returns {Object} Updated task or null
   */
  updateTask(taskId, updates) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return null;

    // Validate status transition
    if (updates.status && !this.isValidStatusTransition(task.status, updates.status)) {
      throw new Error(`Invalid status transition from ${task.status} to ${updates.status}`);
    }

    Object.assign(task, {
      ...updates,
      title: updates.title ? updates.title.trim() : task.title,
      keywords: updates.keywords ? updates.keywords.trim() : task.keywords
    });

    this.saveTasks();
    return task;
  }

  /**
   * Delete a task
   * @param {string} taskId - Task ID
   * @returns {boolean} True if deleted
   */
  deleteTask(taskId) {
    const index = this.tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.saveTasks();
      return true;
    }
    return false;
  }

  /**
   * Get all tasks
   * @returns {Array} All tasks
   */
  getTasks() {
    return this.tasks;
  }

  /**
   * Get task by ID
   * @param {string} taskId - Task ID
   * @returns {Object} Task or null
   */
  getTaskById(taskId) {
    return this.tasks.find(t => t.id === taskId) || null;
  }

  /**
   * Get tasks by status
   * @param {string} status - Task status
   * @returns {Array} Filtered tasks
   */
  getTasksByStatus(status) {
    return this.tasks.filter(t => t.status === status);
  }

  /**
   * Get tasks by priority
   * @param {string} priority - Task priority
   * @returns {Array} Filtered tasks
   */
  getTasksByPriority(priority) {
    return this.tasks.filter(t => t.priority === priority);
  }

  /**
   * Search tasks by keyword
   * @param {string} query - Search query
   * @returns {Array} Matching tasks
   */
  searchTasks(query) {
    const q = query.toLowerCase();
    return this.tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.keywords.toLowerCase().includes(q)
    );
  }

  /**
   * Get tasks with sorting applied
   * @returns {Array} Sorted tasks
   */
  getSortedTasks() {
    return [...this.tasks].sort(compareTasks);
  }

  /**
   * Get filtered and sorted tasks
   * @param {Object} filters - Filter options
   * @returns {Array} Filtered and sorted tasks
   */
  getFilteredTasks(filters = {}) {
    let result = this.tasks;

    // Status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter(t => t.status === filters.status);
    }

    // Priority filter
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter(t => t.priority === filters.priority);
    }

    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.keywords.toLowerCase().includes(q)
      );
    }

    // Sort
    return result.sort(compareTasks);
  }

  /**
   * Get task statistics
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      total: this.tasks.length,
      todo: this.tasks.filter(t => t.status === 'todo').length,
      inProgress: this.tasks.filter(t => t.status === 'in-progress').length,
      done: this.tasks.filter(t => t.status === 'done').length,
      overdue: this.tasks.filter(t => isOverdue(t.dueDate, t.status)).length
    };
  }

  /**
   * Validate status transition
   * Valid transitions: todo -> in-progress -> done
   * @param {string} currentStatus - Current status
   * @param {string} newStatus - New status
   * @returns {boolean} True if valid
   */
  isValidStatusTransition(currentStatus, newStatus) {
    if (currentStatus === newStatus) return true;

    const transitions = {
      'todo': ['in-progress', 'done'],
      'in-progress': ['done', 'todo'],
      'done': ['todo', 'in-progress']
    };

    return transitions[currentStatus]?.includes(newStatus) || false;
  }

  /**
   * Clear all tasks
   */
  clearAll() {
    this.tasks = [];
    this.saveTasks();
  }

  /**
   * Export tasks as JSON
   * @returns {string} JSON string
   */
  exportTasks() {
    return JSON.stringify(this.tasks, null, 2);
  }

  /**
   * Import tasks from JSON
   * @param {string} jsonString - JSON string
   * @returns {boolean} True if successful
   */
  importTasks(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      if (Array.isArray(imported)) {
        this.tasks = imported;
        this.saveTasks();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}

// Create global instance
const taskManager = new TaskManager();
