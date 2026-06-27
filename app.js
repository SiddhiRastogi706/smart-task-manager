/**
 * Main Application Module
 * Orchestrates task manager functionality
 */

class TaskManagerApp {
  constructor() {
    this.taskManager = taskManager;
    this.uiManager = uiManager;
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    this.setupEventListeners();
    this.renderTasks();
    this.updateStats();
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Modal and form events
    this.uiManager.onModalSubmit(
      (formData) => this.handleAddTask(formData),
      (taskId, formData) => this.handleEditTask(taskId, formData)
    );

    // Task card actions (edit/delete)
    this.uiManager.onTaskAction(
      (taskId) => this.handleOpenEdit(taskId),
      (taskId) => this.handleDeleteTask(taskId)
    );

    // Filter and search events
    this.uiManager.onFilterChange((filters) => this.handleFilterChange(filters));
    this.uiManager.onSearchChange((filters) => this.handleFilterChange(filters));
  }

  /**
   * Handle add task
   * @param {Object} formData - Form data
   */
  handleAddTask(formData) {
    try {
      this.taskManager.addTask(formData);
      showToast('Task created successfully!');
      this.renderTasks();
      this.updateStats();
    } catch (error) {
      showToast('Error creating task: ' + error.message);
    }
  }

  /**
   * Handle edit task
   * @param {string} taskId - Task ID
   * @param {Object} formData - Form data
   */
  handleEditTask(taskId, formData) {
    try {
      this.taskManager.updateTask(taskId, formData);
      showToast('Task updated successfully!');
      this.renderTasks();
      this.updateStats();
    } catch (error) {
      showToast('Error updating task: ' + error.message);
    }
  }

  /**
   * Handle open edit modal
   * @param {string} taskId - Task ID
   */
  handleOpenEdit(taskId) {
    const task = this.taskManager.getTaskById(taskId);
    if (task) {
      this.uiManager.openModal(task);
    }
  }

  /**
   * Handle delete task
   * @param {string} taskId - Task ID
   */
  handleDeleteTask(taskId) {
    try {
      if (this.taskManager.deleteTask(taskId)) {
        showToast('Task deleted successfully!');
        this.renderTasks();
        this.updateStats();
      }
    } catch (error) {
      showToast('Error deleting task: ' + error.message);
    }
  }

  /**
   * Handle filter change
   * @param {Object} filters - Filter object
   */
  handleFilterChange(filters) {
    this.renderTasks(filters);
  }

  /**
   * Render tasks with current filters
   * @param {Object} filters - Filter object
   */
  renderTasks(filters = this.uiManager.currentFilters) {
    const filteredTasks = this.taskManager.getFilteredTasks(filters);
    this.uiManager.renderTasks(filteredTasks);
  }

  /**
   * Update statistics display
   */
  updateStats() {
    const stats = this.taskManager.getStats();
    this.uiManager.updateStats(stats);
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new TaskManagerApp();
  });
} else {
  new TaskManagerApp();
}
