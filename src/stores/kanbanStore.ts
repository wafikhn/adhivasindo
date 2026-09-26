import { defineStore } from 'pinia';
import { Board, Column, FilterOptions, LabelType, PriorityType, Task, Toast, User } from '../types/kanban';
import { INITIAL_BOARDS, INITIAL_COLUMNS, INITIAL_TASKS, INITIAL_USERS } from '../utils/initialData';

const STORAGE_KEY = 'adhivasindo_kanban_v1';

export const useKanbanStore = defineStore('kanban', {
  state: () => {
    // Load from local storage or fallback to initial data
    const saved = localStorage.getItem(STORAGE_KEY);
    let initialBoards = INITIAL_BOARDS;
    let initialColumns = INITIAL_COLUMNS;
    let initialTasks = INITIAL_TASKS;
    let initialUsers = INITIAL_USERS;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.boards) initialBoards = parsed.boards;
        if (parsed.columns) initialColumns = parsed.columns;
        if (parsed.tasks) initialTasks = parsed.tasks;
        if (parsed.users) initialUsers = parsed.users;
      } catch (e) {
        console.error('Failed to parse local storage, using initial data:', e);
      }
    }

    return {
      boards: initialBoards as Board[],
      columns: initialColumns as Column[],
      tasks: initialTasks as Task[],
      users: initialUsers as User[],
      activeBoardId: initialBoards[0]?.id || 'board-1',
      selectedTaskId: null as string | null,
      filters: {
        searchQuery: '',
        assigneeId: '',
        label: '',
        priority: '',
        dueDate: ''
      } as FilterOptions,
      toasts: [] as Toast[],
      draggedTaskId: null as string | null
    };
  },

  getters: {
    activeBoard: (state) => state.boards.find(b => b.id === state.activeBoardId),

    filteredTasks: (state) => {
      return state.tasks.filter(task => {
        // Search query filter (title or description)
        if (state.filters.searchQuery) {
          const query = state.filters.searchQuery.toLowerCase();
          const matchesTitle = task.title.toLowerCase().includes(query);
          const matchesDesc = task.description.toLowerCase().includes(query);
          if (!matchesTitle && !matchesDesc) return false;
        }

        // Assignee filter
        if (state.filters.assigneeId && !task.assignees.includes(state.filters.assigneeId)) {
          return false;
        }

        // Label filter
        if (state.filters.label && task.label !== state.filters.label) {
          return false;
        }

        // Priority filter
        if (state.filters.priority && task.priority !== state.filters.priority) {
          return false;
        }

        // Due date filter
        if (state.filters.dueDate) {
          if (state.filters.dueDate === 'overdue') {
            const today = new Date().toISOString().split('T')[0];
            if (!task.dueDate || task.dueDate >= today || task.isCompleted) return false;
          } else if (state.filters.dueDate === 'due-soon') {
            const today = new Date().toISOString().split('T')[0];
            if (!task.dueDate || task.dueDate < today || task.isCompleted) return false;
          } else if (task.dueDate !== state.filters.dueDate) {
            return false;
          }
        }

        return true;
      });
    },

    getTasksByColumn: (state) => {
      return (columnId: string) => {
        return state.tasks
          .filter(t => (t.boardId || 'board-1') === state.activeBoardId && t.columnId === columnId)
          .filter(task => {
            // Search query filter (title or description)
            if (state.filters.searchQuery) {
              const query = state.filters.searchQuery.toLowerCase();
              const matchesTitle = task.title.toLowerCase().includes(query);
              const matchesDesc = task.description.toLowerCase().includes(query);
              if (!matchesTitle && !matchesDesc) return false;
            }

            // Assignee filter
            if (state.filters.assigneeId && !task.assignees.includes(state.filters.assigneeId)) {
              return false;
            }

            // Label filter
            if (state.filters.label && task.label !== state.filters.label) {
              return false;
            }

            // Priority filter
            if (state.filters.priority && task.priority !== state.filters.priority) {
              return false;
            }

            // Due date filter
            if (state.filters.dueDate) {
              const today = new Date().toISOString().split('T')[0];
              if (state.filters.dueDate === 'overdue') {
                if (!task.dueDate || task.dueDate >= today || task.isCompleted) return false;
              } else if (state.filters.dueDate === 'due-soon') {
                if (!task.dueDate || task.dueDate < today || task.isCompleted) return false;
              } else if (task.dueDate !== state.filters.dueDate) {
                return false;
              }
            }

            return true;
          })
          .sort((a, b) => a.order - b.order);
      };
    },

    selectedTask: (state) => {
      return state.tasks.find(t => t.id === state.selectedTaskId) || null;
    },

    getUserById: (state) => {
      return (userId: string) => state.users.find(u => u.id === userId);
    }
  },

  actions: {
    saveToLocalStorage() {
      const dataToSave = {
        boards: this.boards,
        columns: this.columns,
        tasks: this.tasks,
        users: this.users
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    },

    addToast(type: Toast['type'], message: string, duration = 3000) {
      const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
      this.toasts.push({ id, type, message, duration });
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    },

    removeToast(id: string) {
      this.toasts = this.toasts.filter(t => t.id !== id);
    },

    selectBoard(boardId: string) {
      this.activeBoardId = boardId;
      const b = this.boards.find(item => item.id === boardId);
      if (b) {
        this.addToast('info', `Switched to "${b.title}" board`);
      }
    },

    openTaskDetail(taskId: string) {
      this.selectedTaskId = taskId;
    },

    closeTaskDetail() {
      this.selectedTaskId = null;
    },

    createTask(newTaskData: Partial<Task>) {
      const columnTasks = this.getTasksByColumn(newTaskData.columnId || 'to-do');
      const maxOrder = columnTasks.length > 0 ? Math.max(...columnTasks.map(t => t.order)) : 0;

      const newTask: Task = {
        id: 'task-' + Date.now(),
        boardId: newTaskData.boardId || this.activeBoardId,
        title: newTaskData.title || 'Untitled Task',
        description: newTaskData.description || '',
        columnId: newTaskData.columnId || 'to-do',
        label: (newTaskData.label as LabelType) || 'Feature',
        priority: (newTaskData.priority as PriorityType) || 'Medium',
        dueDate: newTaskData.dueDate || new Date().toISOString().split('T')[0],
        assignees: newTaskData.assignees || [],
        subtasks: newTaskData.subtasks || [],
        attachments: newTaskData.attachments || [],
        comments: newTaskData.comments || [],
        coverImage: newTaskData.coverImage,
        isCompleted: false,
        createdAt: new Date().toISOString().split('T')[0],
        order: maxOrder + 1
      };

      this.tasks.push(newTask);
      this.saveToLocalStorage();
      this.addToast('success', `Task "${newTask.title}" standardly created`);
      return newTask;
    },

    updateTask(taskId: string, updates: Partial<Task>) {
      const index = this.tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        this.tasks[index] = {
          ...this.tasks[index],
          ...updates
        };
        this.saveToLocalStorage();
        this.addToast('info', `Task "${this.tasks[index].title}" updated`);
      }
    },

    deleteTask(taskId: string) {
      const task = this.tasks.find(t => t.id === taskId);
      const title = task ? task.title : 'Task';
      this.tasks = this.tasks.filter(t => t.id !== taskId);
      if (this.selectedTaskId === taskId) {
        this.selectedTaskId = null;
      }
      this.saveToLocalStorage();
      this.addToast('warning', `Deleted "${title}"`);
    },

    moveTask(taskId: string, targetColumnId: string, targetOrder?: number) {
      const task = this.tasks.find(t => t.id === taskId);
      if (!task) return;

      const oldColumnId = task.columnId;
      task.columnId = targetColumnId;

      if (targetOrder !== undefined) {
        task.order = targetOrder;
      } else {
        const targetTasks = this.getTasksByColumn(targetColumnId);
        task.order = targetTasks.length;
      }

      // Automatically set isCompleted status if moved to Done column
      if (targetColumnId === 'done' && !task.isCompleted) {
        task.isCompleted = true;
      }

      this.saveToLocalStorage();
      if (oldColumnId !== targetColumnId) {
        const targetCol = this.columns.find(c => c.id === targetColumnId);
        this.addToast('info', `Moved to ${targetCol?.title || targetColumnId}`);
      }
    },

    toggleSubtask(taskId: string, subtaskId: string) {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        const st = task.subtasks.find(s => s.id === subtaskId);
        if (st) {
          st.completed = !st.completed;
          this.saveToLocalStorage();
        }
      }
    },

    addSubtask(taskId: string, title: string) {
      const task = this.tasks.find(t => t.id === taskId);
      if (task && title.trim()) {
        task.subtasks.push({
          id: 'st-' + Date.now(),
          title: title.trim(),
          completed: false
        });
        this.saveToLocalStorage();
        this.addToast('success', 'Subtask added');
      }
    },

    deleteSubtask(taskId: string, subtaskId: string) {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.subtasks = task.subtasks.filter(s => s.id !== subtaskId);
        this.saveToLocalStorage();
      }
    },

    addAttachment(taskId: string, fileData: { name: string; url: string; size: string; type: string }) {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.attachments.push({
          id: 'att-' + Date.now(),
          name: fileData.name,
          url: fileData.url,
          size: fileData.size,
          type: fileData.type,
          createdAt: new Date().toISOString().split('T')[0]
        });
        this.saveToLocalStorage();
        this.addToast('success', `Attachment "${fileData.name}" added`);
      }
    },

    deleteAttachment(taskId: string, attachmentId: string) {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.attachments = task.attachments.filter(a => a.id !== attachmentId);
        this.saveToLocalStorage();
      }
    },

    addComment(taskId: string, text: string, userId = 'user-1') {
      const task = this.tasks.find(t => t.id === taskId);
      if (task && text.trim()) {
        task.comments.push({
          id: 'c-' + Date.now(),
          userId,
          text: text.trim(),
          createdAt: new Date().toISOString().split('T')[0]
        });
        this.saveToLocalStorage();
        this.addToast('info', 'Comment added');
      }
    },

    createColumn(title: string) {
      if (!title.trim()) return;
      const id = 'col-' + title.toLowerCase().replace(/\s+/g, '-');
      if (this.columns.some(c => c.id === id)) return;

      const newCol: Column = {
        id,
        title: title.trim(),
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
        order: this.columns.length + 1
      };

      this.columns.push(newCol);
      this.saveToLocalStorage();
      this.addToast('success', `Column "${newCol.title}" created`);
    },

    updateColumn(columnId: string, title: string) {
      const col = this.columns.find(c => c.id === columnId);
      if (col && title.trim()) {
        col.title = title.trim();
        this.saveToLocalStorage();
        this.addToast('info', `Column renamed to "${col.title}"`);
      }
    },

    deleteColumn(columnId: string) {
      if (this.columns.length <= 1) {
        this.addToast('error', 'Cannot delete the only column!');
        return;
      }
      this.columns = this.columns.filter(c => c.id !== columnId);
      this.tasks = this.tasks.filter(t => t.columnId !== columnId);
      this.saveToLocalStorage();
      this.addToast('warning', 'Column deleted');
    },

    setFilters(filters: Partial<FilterOptions>) {
      this.filters = { ...this.filters, ...filters };
    },

    resetFilters() {
      this.filters = {
        searchQuery: '',
        assigneeId: '',
        label: '',
        priority: '',
        dueDate: ''
      };
    },

    resetToDefaultData() {
      this.boards = INITIAL_BOARDS;
      this.columns = INITIAL_COLUMNS;
      this.tasks = INITIAL_TASKS;
      this.users = INITIAL_USERS;
      this.saveToLocalStorage();
      this.addToast('info', 'Reset to sample initial data');
    },

    exportData() {
      const data = {
        boards: this.boards,
        columns: this.columns,
        tasks: this.tasks,
        users: this.users,
        exportDate: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `adhivasindo-kanban-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      this.addToast('success', 'Data exported to JSON file');
    },

    importData(jsonText: string) {
      try {
        const parsed = JSON.parse(jsonText);
        if (parsed.tasks && parsed.columns) {
          this.tasks = parsed.tasks;
          this.columns = parsed.columns;
          if (parsed.boards) this.boards = parsed.boards;
          if (parsed.users) this.users = parsed.users;
          this.saveToLocalStorage();
          this.addToast('success', 'Data imported successfully!');
        } else {
          this.addToast('error', 'Invalid JSON file format');
        }
      } catch (e) {
        this.addToast('error', 'Failed to parse JSON file');
      }
    }
  }
});
