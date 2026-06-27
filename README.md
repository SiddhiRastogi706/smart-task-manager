# Smart Task Manager

A modern, responsive task management application designed to help you organize and track your keywords with intelligent priority-based sorting and comprehensive filtering.

## Features

### Core Functionality
- **Add, Edit & Delete Tasks**: Create new tasks with titles, keywords, priority levels, status, and due dates
- **Smart Priority Sorting**: Tasks automatically sorted by priority (High → Medium → Low) then by due date
- **Status Workflow**: Enforced status transitions (To Do → In Progress → Done) preventing invalid state changes
- **Real-time Statistics**: Live counters showing total tasks and breakdown by status

### Filtering & Search
- **Status Filters**: View tasks by status (All, To Do, In Progress, Done)
- **Priority Filters**: Filter by priority level (All, High, Medium, Low)
- **Smart Search**: Search across task titles and keywords with debounced input for performance

### User Experience
- **Overdue Detection**: Tasks automatically flagged when due date has passed (excluding completed tasks)
- **Responsive Design**: Mobile-first approach adapts beautifully to all screen sizes
- **Modal Forms**: Clean, focused add/edit experience with validation
- **Toast Notifications**: Real-time feedback for all actions (create, update, delete)
- **Empty State**: Helpful message and icon when no tasks exist

### Data Persistence
- **LocalStorage Integration**: All tasks automatically saved and persisted across sessions
- **No Backend Required**: Fully client-side application for instant performance

## Architecture

### Modular Organization
The application follows a clean, modular architecture:

- **utils.js**: Utility functions for date formatting, validation, and helpers
- **tasks.js**: TaskManager class handling all data operations and business logic
- **ui.js**: UIManager class managing DOM rendering and user interactions
- **app.js**: Main application orchestrator connecting UI with task management
- **styles.css**: Comprehensive styling with semantic design tokens

### Design System

The application uses a carefully crafted color system:

- **Primary**: Blue (#2563eb) for main actions and branding
- **Semantic Colors**: Green (success), Amber (warning), Red (error), Sky (info)
- **Priority Colors**: Red (high), Amber (medium), Gray (low)
- **Neutrals**: Consistent white, gray, and text colors for contrast

### Key Design Decisions

1. **Vanilla JavaScript**: No dependencies for maximum performance and compatibility
2. **Event Delegation**: Efficient event handling for task card actions
3. **Semantic HTML**: Proper ARIA labels and roles for accessibility
4. **CSS Grid & Flexbox**: Modern layout techniques with responsive breakpoints
5. **Form Validation**: Real-time validation with clear error messaging

## Task Lifecycle

1. **Creation**: User fills form with title, keywords, priority, status (defaults to "To Do"), and due date
2. **Sorting**: Tasks automatically sorted by priority and due date
3. **Filtering**: User can filter by status and priority or search by text
4. **Editing**: Click edit icon to modify any task property
5. **Completion**: Move to "Done" status to mark task complete
6. **Deletion**: Remove task with confirmation dialog
7. **Persistence**: All changes automatically saved to localStorage

## Usage

### Getting Started
1. Click "+ Add Task" button
2. Fill in the task form with required fields
3. Select priority and status
4. Choose a due date
5. Click "Save Task"

### Managing Tasks
- **Search**: Type in search box to find tasks by title or keywords
- **Filter by Status**: Click status buttons (To Do, In Progress, Done)
- **Filter by Priority**: Click priority buttons (High, Medium, Low)
- **Edit**: Click the edit icon on a task card
- **Delete**: Click the trash icon and confirm deletion

### Tips
- Tasks are automatically sorted by priority, so high-priority items appear first
- Overdue tasks get a red left border for quick identification
- Use search for quick task lookup among many items
- Filter by "In Progress" to focus on current work
- Mark tasks as "Done" when complete

## Browser Compatibility

The application works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- **Debounced Search**: 300ms delay prevents excessive filtering
- **One-time LocalStorage Load**: All data loaded once on initialization
- **Efficient Rendering**: Only re-renders when data changes
- **Event Delegation**: Single listener for multiple task actions

## Accessibility

- Semantic HTML with proper heading hierarchy
- ARIA labels on all buttons and form controls
- Keyboard navigation support
- Proper color contrast ratios
- Screen reader friendly

## Future Enhancements

Potential features for expansion:
- Categories or tags for tasks
- Recurring task templates
- Task reminders/notifications
- Import/export functionality
- Dark mode theme
- Drag-and-drop reordering
- Collaboration features
- Analytics and reporting

## License

Created by siddhi
