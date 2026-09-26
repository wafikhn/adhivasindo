export type LabelType = 'Feature' | 'Bug' | 'Issue' | 'Undefined';
export type PriorityType = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  url: string;
  type: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  boardId?: string;
  title: string;
  description: string;
  columnId: string;
  label: LabelType;
  priority: PriorityType;
  dueDate: string; // ISO date string or formatted date
  assignees: string[]; // User IDs
  subtasks: Subtask[];
  attachments: Attachment[];
  comments: Comment[];
  coverImage?: string;
  isCompleted: boolean;
  createdAt: string;
  order: number;
}

export interface Column {
  id: string;
  title: string;
  color: string;
  order: number;
}

export interface Board {
  id: string;
  title: string;
}

export interface FilterOptions {
  searchQuery: string;
  assigneeId: string;
  label: string;
  priority: string;
  dueDate: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  duration?: number;
}
