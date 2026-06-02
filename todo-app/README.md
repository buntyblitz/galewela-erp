# Todo List Application

A modern, feature-rich todo list application with local storage persistence, built with vanilla JavaScript, HTML, and CSS.

## 🎯 Features

### Core Features
- ✅ **Add Tasks** - Create new tasks with a single click or Enter key
- ✅ **Priority Levels** - Set priority (Low, Medium, High) for each task
- ✅ **Mark Complete** - Check off completed tasks
- ✅ **Edit Tasks** - Modify task text inline
- ✅ **Delete Tasks** - Remove individual tasks with confirmation
- ✅ **Local Storage** - All tasks persist in browser's local storage
- ✅ **Real-time Stats** - View total, completed, and pending task counts
- ✅ **Search Functionality** - Filter tasks by text search
- ✅ **Smart Filters** - Filter by status (All, Pending, Completed) or priority
- ✅ **Export Data** - Download tasks as JSON file
- ✅ **Bulk Actions** - Clear completed or all tasks
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Date Tracking** - View when tasks were created (Today, Yesterday, or date)

### Technical Features
- 🔒 **No Backend Required** - Fully client-side application
- 💾 **Persistent Storage** - Data survives browser restart
- ⚡ **Fast & Lightweight** - No external dependencies
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations
- ♿ **Accessible** - Semantic HTML and keyboard navigation
- 📱 **Mobile-First** - Optimized for all screen sizes
- 🔍 **Input Validation** - Error handling and user feedback
- 🚀 **Performant** - Optimized rendering and event handling

## 🚀 Quick Start

### 1. Download Files
Download the following files to your local machine:
- `index.html`
- `styles.css`
- `app.js`

### 2. Open in Browser
Simply open `index.html` in your web browser (no server required).

### 3. Start Using
- Type a task in the input field
- Select priority level (optional)
- Click "Add Task" or press Enter
- Manage your tasks!

## 📋 User Guide

### Adding a Task
1. Type your task in the input field
2. Optionally select a priority level (Low, Medium, High)
3. Click the "Add Task" button or press Enter
4. Task appears at the top of your list

### Managing Tasks

**Complete a Task**
- Click the checkbox next to a task
- Completed tasks show strikethrough text

**Edit a Task**
- Click the ✎ (edit) button on a task
- Enter new text in the prompt
- Task updates immediately

**Delete a Task**
- Click the 🗑 (delete) button
- Confirm deletion when prompted
- Task is removed from your list

### Filtering & Searching

**Use Filters**
- **All** - Show all tasks
- **Pending** - Show incomplete tasks
- **Completed** - Show finished tasks
- **High Priority** - Show high priority tasks only

**Search Tasks**
- Type in the search box
- Results update in real-time
- Filters work with search

### Statistics
View real-time counts:
- **Total** - Total number of tasks
- **Completed** - Number of finished tasks
- **Pending** - Number of incomplete tasks

### Bulk Actions

**Clear Completed**
- Removes all completed tasks
- Keeps pending tasks intact

**Export as JSON**
- Downloads all tasks as a JSON file
- Useful for backup or sharing

**Clear All**
- Removes all tasks (use with caution!)
- Requires confirmation

## 💾 Local Storage

### How It Works
- Tasks are automatically saved to browser's local storage
- Data persists between sessions
- No login or account required
- No data sent to any server

### Storage Details
- **Location**: Browser's local storage (private to each browser)
- **Capacity**: Typically 5-10 MB per origin
- **Persistence**: Survives browser restart, but not clearing browser data
- **Privacy**: Data stays on your device

### Check Storage Usage
```javascript
// In browser console
const app = window.todoApp; // If exposed
app.getStorageStats();
```

## 🎨 Customization

### Change Colors
Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;      /* Main color */
    --success-color: #10b981;      /* Complete color */
    --danger-color: #ef4444;       /* Delete color */
    --warning-color: #f59e0b;      /* Warning color */
}
```

### Change Gradient
Modify the background gradient in `body`:

```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adjust Sizes
Modify font sizes and spacing variables:

```css
:root {
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 🔧 Development

### Project Structure
```
todo-app/
├── index.html       # HTML structure
├── styles.css       # Styling
├── app.js          # JavaScript logic
└── README.md       # This file
```

### Key JavaScript Classes

#### TodoApp
Main application class handling all functionality.

**Key Methods:**
- `addTodo()` - Add a new task
- `toggleTodo(id)` - Mark task as complete
- `deleteTodo(id)` - Remove a task
- `editTodo(id)` - Edit task text
- `clearCompleted()` - Remove completed tasks
- `clearAll()` - Remove all tasks
- `exportTodos()` - Export as JSON
- `getFilteredTodos()` - Apply filters and search
- `saveToStorage()` - Save to local storage
- `loadFromStorage()` - Load from local storage
- `render()` - Re-render the UI

### Data Structure
Each task object contains:
```javascript
{
    id: 1717348800000,              // Unique timestamp ID
    text: "Buy groceries",          // Task text
    priority: "high",               // Priority: low, medium, high
    completed: false,               // Completion status
    createdAt: "2024-06-02T...",   // ISO timestamp
    updatedAt: "2024-06-02T..."    // ISO timestamp
}
```

### Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## 🐛 Troubleshooting

### Tasks Not Saving?
- Check if local storage is enabled in browser settings
- Check available storage space
- Try clearing browser cache and reloading

### Tasks Disappearing?
- They only persist if local storage is enabled
- Clearing browser data will delete tasks
- Export tasks regularly as backup

### Slow Performance?
- Clear completed tasks regularly
- Export and clear data if too many tasks
- Use search/filters to reduce rendered items

## 📱 Mobile Features

- Responsive design adapts to all screen sizes
- Touch-friendly buttons and inputs
- Optimized keyboard on mobile devices
- Smooth scrolling for long lists
- One-handed usability

## ⌨️ Keyboard Shortcuts

- **Enter** - Add task (when input focused)
- **Tab** - Navigate between fields
- **Click** - Toggle, edit, or delete tasks

## 🔐 Privacy & Security

- ✅ No data sent to any server
- ✅ No tracking or analytics
- ✅ No login required
- ✅ Data stays 100% on your device
- ✅ No cookies or third-party services
- ✅ Open source code you can inspect

## 📄 License

This project is provided as-is for personal use.

## 🤝 Contributions

Feel free to fork, modify, and use this application for your needs!

## 📝 Notes

- Maximum task length: 500 characters
- Maximum tasks: Depends on browser's local storage capacity
- Tasks are stored in order (newest first)
- Deleted tasks cannot be recovered
- Regular backups recommended via export feature

---

**Enjoy organizing your tasks!** 📝✨
