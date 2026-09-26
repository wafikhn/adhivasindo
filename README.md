# Adhivasindo Task Management Board (Vue 3 + SASS)

A modern, responsive, and pixel-perfect **Task Management Kanban Board** application built for the **Adhivasindo Frontend Technical Test**. 

Built with **Vue 3**, **TypeScript**, **Vite**, **Pinia**, and **Modular SASS (SCSS)** with LocalStorage data persistence.

---

## 🚀 Live Demo & Features

### 📋 Key Features

1. **Board & Column Management**
   - **Pre-configured Columns**: `To do`, `Doing`, `Review`, `Done`, `Rework` (matching PDF design specifications).
   - **Dynamic Columns**: Add new custom columns (`+ Add new List`), inline column renaming, and column deletion.
   - **Multi-Board Support**: Switch between multiple boards (*Adhivasindo*, *Northern Light*, *Marketing Campaign*) or create custom boards.

2. **Task Cards & Metadata**
   - **Label Pills**: Soft-toned tags for `Feature`, `Bug`, `Issue`, and `Undefined`.
   - **Priority Badges**: `Low`, `Medium`, `High`, and `Urgent`.
   - **Subtask Progress Bar**: Animated progress bar on each card indicating completed subtasks ratio.
   - **Cover Image**: Support for cover image banners on cards and detail view.
   - **Card Footer**: Due Date indicator, Checklist counter (e.g., `10/19`), Comments/Attachments count, and stacked Assignee avatars.

3. **Task Detail & Full CRUD Modal**
   - **Create & Read**: Click to open task detail view or add new tasks via header/column buttons.
   - **Update**: Edit title, description, assignees, due date, board, column, label, priority, cover image.
   - **Delete**: Remove tasks with prompt confirmation.
   - **✓ Mark Complete**: Quick toggle button with **Confetti explosion animation** upon completion.
   - **Subtask Checklist**: Add/remove subtasks, checkbox toggle, and live progress tracking.
   - **Attachments**: Drag & Drop dropzone for file attachments.
   - **Activity & Comments**: Post comments and track user discussion history.

4. **Drag and Drop**
   - Native HTML5 Drag and Drop for moving cards between columns seamlessly.

5. **Searching & Filtering**
   - **Real-Time Search**: Search tasks by title or description text.
   - **Multi-Filter Dropdown**: Filter by Assignee, Label, Priority, or Due Date status (*Overdue*, *Due Soon*).

6. **Data Persistence & Portability**
   - **LocalStorage Persistence**: Auto-saves state (`adhivasindo_kanban_v1`) without requiring a backend database.
   - **Export & Import JSON**: Export complete board data to a `.json` file and import back anytime.
   - **Sample Data Reset**: One-click reset to initial reference sample dataset.

7. **Notification System & SASS Architecture**
   - **Toast Notifications**: Floating alerts for task creation, movement, updates, and deletion.
   - **Modular SASS**: Clean separation of variables, base styles, header, board, columns, cards, modals, and toasts.

---

## 🛠️ Technology Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API `<script setup>`)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Pinia](https://pinia.vuejs.org/) (with Vuex adapter layer)
- **Styling**: [SASS / SCSS](https://sass-lang.com/) (Modular architecture)
- **Icons**: [Lucide Vue Next](https://lucide.dev/)
- **Animations & Effects**: [Canvas Confetti](https://github.com/catdad/canvas-confetti)

---

## 📂 Project Structure

```
adhivasindo/
├── public/
│   └── favicon.svg              # Adhivasindo brand icon
├── src/
│   ├── assets/                  # Images & static assets
│   ├── components/
│   │   ├── Header.vue           # Navbar, board selector, team avatars, filter, & search
│   │   ├── KanbanBoard.vue      # Main board container & column scroll list
│   │   ├── KanbanColumn.vue     # Column container & inline task creation
│   │   ├── TaskCard.vue         # Individual task card component
│   │   ├── TaskModal.vue        # Task detail & CRUD modal (PDF page 3 layout)
│   │   ├── InviteModal.vue      # Team member invitation modal
│   │   └── ToastContainer.vue   # Floating toast notifications container
│   ├── stores/
│   │   ├── kanbanStore.ts       # Pinia store with LocalStorage persistence
│   │   └── vuexStore.ts         # LocalStorage adapter layer
│   ├── styles/
│   │   ├── main.scss            # Main SCSS entry point
│   │   ├── _variables.scss      # Design tokens, colors, radii & fonts
│   │   ├── _base.scss           # Base resets, typography & buttons
│   │   ├── _header.scss         # Header component styles
│   │   ├── _board.scss          # Board layout styles
│   │   ├── _column.scss         # Column styles
│   │   ├── _card.scss           # Card styles
│   │   ├── _modal.scss          # Modal styles
│   │   └── _toast.scss          # Toast notification styles
│   ├── types/
│   │   └── kanban.ts            # TypeScript interfaces
│   ├── utils/
│   │   └── initialData.ts       # Pre-populated initial dataset matching PDF
│   ├── App.vue                  # Root component
│   └── main.ts                  # App initialization
├── test.pdf                     # Original test requirement PDF
├── index.html                   # Entry HTML
├── package.json                 # Dependencies & scripts
└── vite.config.ts               # Vite configuration
```

---

## 📦 Getting Started

### Prerequisites

- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Installation

1. Clone or navigate to the repository directory:
   ```bash
   cd adhivasindo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Run the development server locally:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

Check TypeScript types and compile the production bundle:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

---

## 📜 License

MIT License - Created for Frontend Technical Assessment at **Adhivasindo**.
