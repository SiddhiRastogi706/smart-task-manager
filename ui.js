/**
 * UI Management Module
 * Handles all DOM rendering and updates
 */

class UIManager {
  constructor() {
    this.modal = document.getElementById('taskModal');
    this.modalOverlay = document.getElementById('modalOverlay');
    this.taskForm = document.getElementById('taskForm');
    this.tasksContainer = document.getElementById('tasksContainer');
    this.emptyState = document.getElementById('emptyState');
    this.searchInput = document.getElementById('searchInput');
    this.currentEditingId = null;
    this.currentFilters = {
      status: 'all',
      priority: 'all',
      search: ''
    };
  }

  /**
   * Render all tasks
   * @param {Array} tasks - Tasks to render
   */
  renderTasks(tasks) {
    this.tasksContainer.innerHTML = '';

    if (tasks.length === 0) {
      this.emptyState.classList.add('visible');
      return;
    }

    this.emptyState.classList.remove('visible');

    tasks.forEach(task => {
      const taskElement = this.createTaskElement(task);
      this.tasksContainer.appendChild(taskElement);
    });
  }

  /**
   * Create a task card element
   * @param {Object} task - Task data
   * @returns {HTMLElement} Task element
   */
  createTaskElement(task) {
    const overdue = isOverdue(task.dueDate, task.status);
    const daysUntilDue = getDaysUntilDue(task.dueDate);

    const card = document.createElement('div');
    card.className = `task-card ${overdue ? 'overdue' : ''}`;
    card.id = `task-${task.id}`;

    card.innerHTML = `
      <div class="task-header">
        <h3 class="task-title">${escapeHTML(task.title)}</h3>
        <div class="task-actions">
          <button class="task-btn edit-btn" data-id="${task.id}" title="Edit task" aria-label="Edit task">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="task-btn delete-btn" data-id="${task.id}" title="Delete task" aria-label="Delete task">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="badges">
        <span class="badge badge-status ${task.status}">
          ${task.status.replace('-', ' ')}
        </span>
        <span class="badge badge-priority ${task.priority}">
          ${task.priority}
        </span>
        ${overdue ? '<span class="badge badge-overdue">OVERDUE</span>' : ''}
      </div>

      <div class="task-keywords">
        ${escapeHTML(task.keywords)}
      </div>

      <div class="task-footer">
        <span class="task-due-date ${overdue ? 'overdue' : ''}">
          📅 ${formatDate(task.dueDate)}
          ${overdue ? ` (${Math.abs(daysUntilDue)} days ago)` : daysUntilDue === 0 ? ' (Today)' : ''}
        </span>
      </div>
    `;

    return card;
  }

  /**
   * Update statistics display
   * @param {Object} stats - Statistics object
   */
  updateStats(stats) {
    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statTodo').textContent = stats.todo;
    document.getElementById('statProgress').textContent = stats.inProgress;
    document.getElementById('statDone').textContent = stats.done;
  }

  /**
   * Open modal for adding/editing task
   * @param {Object} task - Task to edit (null for new task)
   */
  openModal(task = null) {
    this.currentEditingId = task ? task.id : null;
    const modalTitle = document.getElementById('modalTitle');
    const taskTitle = document.getElementById('taskTitle');
    const taskKeywords = document.getElementById('taskKeywords');
    const taskPriority = document.getElementById('taskPriority');
    const taskStatus = document.getElementById('taskStatus');
    const taskDueDate = document.getElementById('taskDueDate');

    // Clear form
    this.clearFormErrors();

    if (task) {
      // Edit mode
      modalTitle.textContent = 'Edit Task';
      taskTitle.value = task.title;
      taskKeywords.value = task.keywords;
      taskPriority.value = task.priority;
      taskStatus.value = task.status;
      taskDueDate.value = task.dueDate;
    } else {
      // New task mode
      modalTitle.textContent = 'Add New Task';
      taskTitle.value = '';
      taskKeywords.value = '';
      taskPriority.value = '';
      taskStatus.value = 'todo';
      taskDueDate.value = new Date().toISOString().split('T')[0];
    }

    this.modal.classList.add('active');
    taskTitle.focus();
  }

  /**
   * Close modal
   */
  closeModal() {
    this.modal.classList.remove('active');
    this.currentEditingId = null;
    this.taskForm.reset();
    this.clearFormErrors();
  }

  /**
   * Get form data
   * @returns {Object} Form data
   */
  getFormData() {
    return {
      title: document.getElementById('taskTitle').value,
      keywords: document.getElementById('taskKeywords').value,
      priority: document.getElementById('taskPriority').value,
      status: document.getElementById('taskStatus').value,
      dueDate: document.getElementById('taskDueDate').value
    };
  }

  /**
   * Validate form
   * @returns {Object} Validation result { isValid, errors }
   */
  validateForm() {
    const errors = {};
    const data = this.getFormData();

    if (!data.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!data.keywords.trim()) {
      errors.keywords = 'Keywords are required';
    }

    if (!data.priority) {
      errors.priority = 'Priority is required';
    }

    if (!data.status) {
      errors.status = 'Status is required';
    }

    if (!data.dueDate) {
      errors.dueDate = 'Due date is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Show form errors
   * @param {Object} errors - Error messages
   */
  showFormErrors(errors) {
    this.clearFormErrors();

    Object.keys(errors).forEach(field => {
      const errorElement = document.getElementById(`error${field.charAt(0).toUpperCase() + field.slice(1)}`);
      const inputElement = document.getElementById(`task${field.charAt(0).toUpperCase() + field.slice(1)}`);

      if (errorElement) {
        errorElement.textContent = errors[field];
        errorElement.classList.add('visible');
      }

      if (inputElement) {
        inputElement.classList.add('error');
      }
    });
  }

  /**
   * Clear all form errors
   */
  clearFormErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
      el.classList.remove('visible');
      el.textContent = '';
    });

    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(el => {
      el.classList.remove('error');
    });
  }

  /**
   * Set active filter button
   * @param {string} filterType - Filter type (status or priority)
   * @param {string} value - Filter value
   */
  setActiveFilter(filterType, value) {
    const selector = filterType === 'status' ? '.filter-btn' : '.priority-btn';
    const attribute = filterType === 'status' ? 'data-filter' : 'data-priority';

    document.querySelectorAll(selector).forEach(btn => {
      btn.classList.remove('active');
    });

    document.querySelector(`${selector}[${attribute}="${value}"]`).classList.add('active');
  }

  /**
   * Handle search input
   * @param {Function} callback - Callback function
   */
  onSearchChange(callback) {
    const debouncedCallback = debounce(() => {
      this.currentFilters.search = this.searchInput.value;
      callback(this.currentFilters);
    }, 300);

    this.searchInput.addEventListener('input', debouncedCallback);
  }

  /**
   * Handle filter button clicks
   * @param {Function} callback - Callback function
   */
  onFilterChange(callback) {
    // Status filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const status = e.target.dataset.filter;
        this.currentFilters.status = status;
        this.setActiveFilter('status', status);
        callback(this.currentFilters);
      });
    });

    // Priority filters
    document.querySelectorAll('.priority-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const priority = e.target.dataset.priority;
        this.currentFilters.priority = priority;
        this.setActiveFilter('priority', priority);
        callback(this.currentFilters);
      });
    });
  }

  /**
   * Handle task card buttons via event delegation
   * @param {Function} onEdit - Edit callback
   * @param {Function} onDelete - Delete callback
   */
  onTaskAction(onEdit, onDelete) {
    this.tasksContainer.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.edit-btn');
      const deleteBtn = e.target.closest('.delete-btn');

      if (editBtn) {
        const taskId = editBtn.dataset.id;
        onEdit(taskId);
      }

      if (deleteBtn) {
        const taskId = deleteBtn.dataset.id;
        if (confirm('Are you sure you want to delete this task?')) {
          onDelete(taskId);
        }
      }
    });
  }

  /**
   * Handle modal interactions
   * @param {Function} onAddTask - Add task callback
   * @param {Function} onEditTask - Edit task callback
   */
  onModalSubmit(onAddTask, onEditTask) {
    document.getElementById('btnAddTask').addEventListener('click', () => {
      this.openModal();
    });

    document.getElementById('btnCloseModal').addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('btnCancel').addEventListener('click', () => {
      this.closeModal();
    });

    this.modalOverlay.addEventListener('click', () => {
      this.closeModal();
    });

    this.taskForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const validation = this.validateForm();
      if (!validation.isValid) {
        this.showFormErrors(validation.errors);
        return;
      }

      const formData = this.getFormData();

      if (this.currentEditingId) {
        onEditTask(this.currentEditingId, formData);
      } else {
        onAddTask(formData);
      }

      this.closeModal();
    });
  }
}

// Create global instance
const uiManager = new UIManager();
