/**
 * Advanced Todo List Application
 * With due dates, categories, recurring tasks, and drag & drop
 */

class AdvancedTodoApp {
    constructor() {
        // DOM Elements
        this.todoInput = document.getElementById('todoInput');
        this.categorySelect = document.getElementById('categorySelect');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.dueDateInput = document.getElementById('dueDateInput');
        this.recurringCheckbox = document.getElementById('recurringCheckbox');
        this.recurringSelect = document.getElementById('recurringSelect');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.searchInput = document.getElementById('searchInput');
        this.sortSelect = document.getElementById('sortSelect');
        this.themeToggle = document.getElementById('themeToggle');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.categoryBtns = document.querySelectorAll('.category-btn');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.importBtn = document.getElementById('importBtn');
        this.importFile = document.getElementById('importFile');
        
        // Stats
        this.totalTasksEl = document.getElementById('totalTasks');
        this.completedTasksEl = document.getElementById('completedTasks');
        this.pendingTasksEl = document.getElementById('pendingTasks');
        this.overdueTasksEl = document.getElementById('overdueTasks');

        // State
        this.todos = [];
        this.currentFilter = 'all';
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.sortBy = 'newest';
        this.storageKey = 'advanced_todos_app';
        this.customCategories = ['work', 'personal', 'shopping', 'health', 'education'];
        this.draggedItem = null;
        this.darkMode = false;

        // Initialize
        this.init();
    }

    /**
     * Initialize the app
     */
    init() {
        this.loadFromStorage();
        this.loadDarkMode();
        this.attachEventListeners();
        this.render();
    }

    /**
     * Attach all event listeners
     */
    attachEventListeners() {
        // Add todo
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Recurring toggle
        this.recurringCheckbox.addEventListener('change', (e) => {
            this.recurringSelect.disabled = !e.target.checked;
        });

        // Search
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.render();
        });

        // Sort
        this.sortSelect.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.render();
        });

        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Filters
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });

        // Category filters
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.categoryBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.category;
                this.render();
            });
        });

        // Action buttons
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.clearAllBtn.addEventListener('click', () => this.clearAll());
        this.exportBtn.addEventListener('click', () => this.exportTodos());
        this.importBtn.addEventListener('click', () => this.importFile.click());
        this.importFile.addEventListener('change', (e) => this.importTodos(e));

        // Category select
        this.categorySelect.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                e.target.value = '';
                this.showCategoryModal();
            }
        });
    }

    /**
     * Add a new todo
     */
    addTodo() {
        const text = this.todoInput.value.trim();
        const priority = this.prioritySelect.value;
        const category = this.categorySelect.value;
        const dueDate = this.dueDateInput.value;
        const recurring = this.recurringCheckbox.checked ? this.recurringSelect.value : null;

        // Validation
        if (!text) {
            this.showError('Please enter a task');
            return;
        }

        if (text.length > 500) {
            this.showError('Task is too long (max 500 characters)');
            return;
        }

        // Create todo object
        const todo = {
            id: Date.now(),
            text: text,
            priority: priority,
            category: category || 'general',
            dueDate: dueDate || null,
            recurring: recurring,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completedAt: null
        };

        // Add to todos array
        this.todos.unshift(todo);

        // If recurring, create next occurrence
        if (recurring) {
            this.createNextOccurrence(todo);
        }

        // Update storage and render
        this.saveToStorage();
        this.render();

        // Clear input
        this.todoInput.value = '';
        this.categorySelect.value = '';
        this.prioritySelect.value = 'medium';
        this.dueDateInput.value = '';
        this.recurringCheckbox.checked = false;
        this.recurringSelect.disabled = true;
        this.recurringSelect.value = '';
        this.todoInput.focus();
    }

    /**
     * Create next occurrence for recurring task
     */
    createNextOccurrence(todo) {
        if (!todo.recurring || !todo.dueDate) return;

        const dueDate = new Date(todo.dueDate);
        let nextDate = new Date(dueDate);

        switch (todo.recurring) {
            case 'daily':
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            case 'weekly':
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case 'biweekly':
                nextDate.setDate(nextDate.getDate() + 14);
                break;
            case 'monthly':
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
        }

        // Create next occurrence after current date
        if (nextDate > new Date()) {
            const nextTodo = {
                ...todo,
                id: Date.now() + 1,
                dueDate: nextDate.toISOString().split('T')[0],
                completed: false,
                createdAt: new Date().toISOString()
            };
            this.todos.push(nextTodo);
        }
    }

    /**
     * Toggle task completion
     */
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.completedAt = todo.completed ? new Date().toISOString() : null;
            todo.updatedAt = new Date().toISOString();
            this.saveToStorage();
            this.render();
        }
    }

    /**
     * Delete a todo
     */
    deleteTodo(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveToStorage();
            this.render();
        }
    }

    /**
     * Edit a todo
     */
    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        // Open edit modal
        document.getElementById('editTaskInput').value = todo.text;
        document.getElementById('editCategorySelect').value = todo.category;
        document.getElementById('editPrioritySelect').value = todo.priority;
        document.getElementById('editDueDateInput').value = todo.dueDate || '';
        
        window.editingTodoId = id;
        document.getElementById('editModal').classList.add('active');
    }

    /**
     * Clear completed todos
     */
    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        
        if (completedCount === 0) {
            alert('No completed tasks to clear');
            return;
        }

        if (confirm(`Delete ${completedCount} completed task(s)?`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveToStorage();
            this.render();
        }
    }

    /**
     * Clear all todos
     */
    clearAll() {
        if (this.todos.length === 0) {
            alert('No tasks to clear');
            return;
        }

        if (confirm(`Delete all ${this.todos.length} task(s)? This cannot be undone.`)) {
            this.todos = [];
            this.saveToStorage();
            this.render();
        }
    }

    /**
     * Export todos as JSON
     */
    exportTodos() {
        const dataStr = JSON.stringify(this.todos, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `todos_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Import todos from JSON
     */
    importTodos(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    if (confirm('Replace existing tasks with imported ones?')) {
                        this.todos = imported;
                    } else {
                        this.todos = [...this.todos, ...imported];
                    }
                    this.saveToStorage();
                    this.render();
                    alert('Tasks imported successfully!');
                }
            } catch (error) {
                alert('Failed to import. Invalid JSON file.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    /**
     * Check if task is overdue
     */
    isOverdue(todo) {
        if (!todo.dueDate || todo.completed) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(todo.dueDate);
        return dueDate < today;
    }

    /**
     * Check if task is due today
     */
    isDueToday(todo) {
        if (!todo.dueDate) return false;
        const today = new Date().toISOString().split('T')[0];
        return todo.dueDate === today;
    }

    /**
     * Check if task is due tomorrow
     */
    isDueTomorrow(todo) {
        if (!todo.dueDate) return false;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        return todo.dueDate === tomorrowStr;
    }

    /**
     * Filter todos based on current filters
     */
    getFilteredTodos() {
        let filtered = this.todos;

        // Apply status filter
        switch (this.currentFilter) {
            case 'pending':
                filtered = filtered.filter(t => !t.completed);
                break;
            case 'completed':
                filtered = filtered.filter(t => t.completed);
                break;
            case 'high':
                filtered = filtered.filter(t => t.priority === 'high' && !t.completed);
                break;
            case 'today':
                filtered = filtered.filter(t => this.isDueToday(t));
                break;
            case 'overdue':
                filtered = filtered.filter(t => this.isOverdue(t));
                break;
            default:
                break;
        }

        // Apply category filter
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(t => t.category === this.currentCategory);
        }

        // Apply search
        if (this.searchQuery) {
            filtered = filtered.filter(t => 
                t.text.toLowerCase().includes(this.searchQuery)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'priority':
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                case 'duedate':
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'completed':
                    return a.completed - b.completed;
                default: // newest
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        return filtered;
    }

    /**
     * Update statistics
     */
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = total - completed;
        const overdue = this.todos.filter(t => this.isOverdue(t)).length;

        this.totalTasksEl.textContent = total;
        this.completedTasksEl.textContent = completed;
        this.pendingTasksEl.textContent = pending;
        this.overdueTasksEl.textContent = overdue;
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorEl = document.getElementById('inputError');
        errorEl.textContent = message;
        setTimeout(() => {
            errorEl.textContent = '';
        }, 4000);
    }

    /**
     * Format date
     */
    formatDate(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today, ' + date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday, ' + date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    /**
     * Format due date for display
     */
    formatDueDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else if (date < today) {
            return 'Overdue: ' + date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    }

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Render the todo list
     */
    render() {
        const filteredTodos = this.getFilteredTodos();

        // Update stats
        this.updateStats();

        // Update button states
        this.clearCompletedBtn.disabled = !this.todos.some(t => t.completed);
        this.clearAllBtn.disabled = this.todos.length === 0;
        this.exportBtn.disabled = this.todos.length === 0;

        // Empty state
        if (filteredTodos.length === 0) {
            this.todoList.innerHTML = `
                <div class="empty-state">
                    <p>${this.searchQuery ? '🔍 No tasks found' : '🎉 No tasks yet. Start by adding one!'}</p>
                </div>
            `;
            return;
        }

        // Render todos
        this.todoList.innerHTML = filteredTodos.map(todo => this.createTodoElement(todo)).join('');

        // Attach event listeners
        this.attachTodoEventListeners();
    }

    /**
     * Create a todo element
     */
    createTodoElement(todo) {
        const isOverdue = this.isOverdue(todo);
        const isDueToday = this.isDueToday(todo);
        const isDueTomorrow = this.isDueTomorrow(todo);

        let dueDateBadge = '';
        if (todo.dueDate) {
            const dateClass = isOverdue ? 'overdue' : (isDueToday ? 'today' : (isDueTomorrow ? 'tomorrow' : ''));
            dueDateBadge = `<span class="due-date-badge ${dateClass}">${this.formatDueDate(todo.dueDate)}</span>`;
        }

        let recurringBadge = '';
        if (todo.recurring) {
            recurringBadge = `<span class="recurring-badge">🔄 ${todo.recurring}</span>`;
        }

        return `
            <div class="todo-item ${todo.category} ${isOverdue ? 'overdue' : ''}" draggable="true" data-id="${todo.id}">
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    data-id="${todo.id}"
                >
                <div class="todo-content">
                    <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                    <div class="todo-meta">
                        <span class="priority-badge ${todo.priority}">
                            ${todo.priority}
                        </span>
                        ${todo.category ? `<span class="category-badge ${todo.category}">${todo.category}</span>` : ''}
                        ${dueDateBadge}
                        ${recurringBadge}
                        <span class="todo-date">${this.formatDate(todo.createdAt)}</span>
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="todo-btn edit" data-id="${todo.id}" title="Edit task">✎</button>
                    <button class="todo-btn delete" data-id="${todo.id}" title="Delete task">🗑</button>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners to todo items
     */
    attachTodoEventListeners() {
        // Checkboxes
        document.querySelectorAll('.checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.toggleTodo(parseInt(e.target.dataset.id));
            });
        });

        // Edit buttons
        document.querySelectorAll('.todo-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.editTodo(parseInt(e.target.dataset.id));
            });
        });

        // Delete buttons
        document.querySelectorAll('.todo-btn.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.deleteTodo(parseInt(e.target.dataset.id));
            });
        });

        // Drag and drop
        document.querySelectorAll('.todo-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedItem = e.currentTarget;
                e.currentTarget.classList.add('dragging');
            });

            item.addEventListener('dragend', (e) => {
                e.currentTarget.classList.remove('dragging');
                this.todoList.classList.remove('drag-over');
            });
        });
    }

    /**
     * Toggle dark mode
     */
    toggleTheme() {
        this.darkMode = !this.darkMode;
        document.body.classList.toggle('dark-mode', this.darkMode);
        this.themeToggle.textContent = this.darkMode ? '☀️' : '🌙';
        localStorage.setItem('todo_dark_mode', this.darkMode);
    }

    /**
     * Load dark mode preference
     */
    loadDarkMode() {
        this.darkMode = localStorage.getItem('todo_dark_mode') === 'true';
        if (this.darkMode) {
            document.body.classList.add('dark-mode');
            this.themeToggle.textContent = '☀️';
        }
    }

    /**
     * Save todos to local storage
     */
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    }

    /**
     * Load todos from local storage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            this.todos = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            this.todos = [];
        }
    }
}

// Drag and drop handlers
function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
}

function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    // TODO: Implement drag and drop reordering if needed
}

// Modal handlers
function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('active');
}

function createCustomCategory() {
    const input = document.getElementById('newCategoryInput');
    const categoryName = input.value.trim().toLowerCase();
    
    if (!categoryName) {
        alert('Please enter a category name');
        return;
    }

    // Add custom category to select
    const select = document.getElementById('categorySelect');
    const option = document.createElement('option');
    option.value = categoryName;
    option.textContent = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    select.insertBefore(option, select.lastElementChild);
    
    // Set as selected
    select.value = categoryName;
    
    input.value = '';
    closeCategoryModal();
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
}

function saveEditedTask() {
    const todoId = window.editingTodoId;
    const app = window.todoApp;
    const todo = app.todos.find(t => t.id === todoId);
    
    if (todo) {
        todo.text = document.getElementById('editTaskInput').value.trim();
        todo.category = document.getElementById('editCategorySelect').value;
        todo.priority = document.getElementById('editPrioritySelect').value;
        todo.dueDate = document.getElementById('editDueDateInput').value;
        todo.updatedAt = new Date().toISOString();
        
        app.saveToStorage();
        app.render();
        closeEditModal();
    }
}

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new AdvancedTodoApp();
});
