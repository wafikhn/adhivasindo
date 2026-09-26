import { Board, Column, Task, User } from '../types/kanban';

export const INITIAL_BOARDS: Board[] = [
  { id: 'board-1', title: 'Adhivasindo' },
  { id: 'board-2', title: 'Northern Light' },
  { id: 'board-3', title: 'Marketing Campaign' },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    color: '#3B82F6'
  },
  {
    id: 'user-2',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    color: '#EC4899'
  },
  {
    id: 'user-3',
    name: 'Michael Scott',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    color: '#10B981'
  },
  {
    id: 'user-4',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    color: '#8B5CF6'
  },
  {
    id: 'user-5',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    color: '#F59E0B'
  }
];

export const INITIAL_COLUMNS: Column[] = [
  { id: 'to-do', title: 'To do', color: '#64748B', order: 1 },
  { id: 'doing', title: 'Doing', color: '#3B82F6', order: 2 },
  { id: 'review', title: 'Review', color: '#8B5CF6', order: 3 },
  { id: 'done', title: 'Done', color: '#10B981', order: 4 },
  { id: 'rework', title: 'Rework', color: '#F59E0B', order: 5 },
];

export const INITIAL_TASKS: Task[] = [
  // Board 1: Adhivasindo Tasks
  {
    id: 'task-1',
    boardId: 'board-1',
    title: 'Research for a podcast and video website',
    description: 'Conduct market research and user interviews for podcast streaming platforms and media hubs.',
    columnId: 'to-do',
    label: 'Feature',
    priority: 'Medium',
    dueDate: '2025-08-08',
    assignees: ['user-1', 'user-2'],
    subtasks: [],
    attachments: [],
    comments: [],
    isCompleted: false,
    createdAt: '2025-08-01',
    order: 1
  },
  {
    id: 'task-2',
    boardId: 'board-1',
    title: 'Debug checkout process for the e-commerce website',
    description: 'Fix payment gateway errors, address form validation bugs, and resolve checkout timeouts.',
    columnId: 'to-do',
    label: 'Bug',
    priority: 'High',
    dueDate: '2025-08-15',
    assignees: ['user-1', 'user-2', 'user-3'],
    subtasks: Array.from({ length: 19 }, (_, i) => ({
      id: `st-2-${i}`,
      title: `Subtask verification step ${i + 1}`,
      completed: i < 10
    })),
    attachments: [
      { id: 'att-1', name: 'error-log.txt', size: '24 KB', url: '#', type: 'text', createdAt: '2025-08-02' },
      { id: 'att-2', name: 'checkout-screenshot.png', size: '1.2 MB', url: 'https://images.unsplash.com/photo-1556742049-0a6791497717?auto=format&fit=crop&w=600&q=80', type: 'image', createdAt: '2025-08-02' }
    ],
    comments: Array.from({ length: 43 }, (_, i) => ({
      id: `c-2-${i}`,
      userId: 'user-1',
      text: `Comment note #${i + 1} regarding checkout issue.`,
      createdAt: '2025-08-03'
    })),
    isCompleted: false,
    createdAt: '2025-08-01',
    order: 2
  },
  {
    id: 'task-3',
    boardId: 'board-1',
    title: 'Interior Design & Office Concept Layout',
    description: 'Moodboards, color palettes, and modern architectural mockups for workspace aesthetics.',
    columnId: 'to-do',
    label: 'Feature',
    priority: 'Low',
    dueDate: '2025-08-20',
    assignees: ['user-4'],
    subtasks: [],
    attachments: [],
    comments: [],
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
    isCompleted: false,
    createdAt: '2025-08-02',
    order: 3
  },
  {
    id: 'task-4',
    boardId: 'board-1',
    title: 'Design wireframes for the landing page revamp',
    description: 'Create high-fidelity wireframes in Figma for desktop, tablet, and mobile views.',
    columnId: 'doing',
    label: 'Feature',
    priority: 'High',
    dueDate: '2025-08-12',
    assignees: ['user-2', 'user-3'],
    subtasks: [],
    attachments: [],
    comments: Array.from({ length: 12 }, (_, i) => ({
      id: `c-4-${i}`,
      userId: 'user-2',
      text: `Wireframe feedback iteration ${i + 1}`,
      createdAt: '2025-08-05'
    })),
    isCompleted: false,
    createdAt: '2025-08-03',
    order: 1
  },
  {
    id: 'task-5',
    boardId: 'board-1',
    title: 'Modern Architecture Structure Study',
    description: 'Visual benchmark of modern architectural building designs for client showcase.',
    columnId: 'doing',
    label: 'Undefined',
    priority: 'Low',
    dueDate: '2025-08-25',
    assignees: ['user-1', 'user-4'],
    subtasks: [],
    attachments: [],
    comments: [],
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    isCompleted: false,
    createdAt: '2025-08-03',
    order: 2
  },
  {
    id: 'task-6',
    boardId: 'board-1',
    title: 'Install and set up a marketing tool for team operations',
    description: 'Configure Hubspot integration, tracking pixels, and automated email campaigns.',
    columnId: 'doing',
    label: 'Undefined',
    priority: 'Medium',
    dueDate: '2025-08-14',
    assignees: ['user-1', 'user-3', 'user-4'],
    subtasks: Array.from({ length: 20 }, (_, i) => ({
      id: `st-6-${i}`,
      title: `Setup step ${i + 1}`,
      completed: i < 12
    })),
    attachments: [],
    comments: Array.from({ length: 14 }, (_, i) => ({
      id: `c-6-${i}`,
      userId: 'user-3',
      text: `Setup update note ${i + 1}`,
      createdAt: '2025-08-06'
    })),
    isCompleted: false,
    createdAt: '2025-08-04',
    order: 3
  },
  {
    id: 'task-7',
    boardId: 'board-1',
    title: 'Create and refine logo designs for the UI brand',
    description: 'Design multiple vector logo options and brand guidelines for official launch.',
    columnId: 'review',
    label: 'Issue',
    priority: 'High',
    dueDate: '2025-08-18',
    assignees: ['user-2', 'user-4'],
    subtasks: [],
    attachments: [],
    comments: Array.from({ length: 52 }, (_, i) => ({
      id: `c-7-${i}`,
      userId: 'user-4',
      text: `Logo feedback comment ${i + 1}`,
      createdAt: '2025-08-07'
    })),
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    isCompleted: false,
    createdAt: '2025-08-05',
    order: 1
  },
  {
    id: 'task-8',
    boardId: 'board-1',
    title: 'Create an icon library for the project.',
    description: 'Export SVG icon set, build custom font icon package, and organize documentation.',
    columnId: 'review',
    label: 'Feature',
    priority: 'Medium',
    dueDate: '2025-08-08',
    assignees: ['user-1', 'user-2'],
    subtasks: Array.from({ length: 18 }, (_, i) => ({
      id: `st-8-${i}`,
      title: `Icon item #${i + 1}`,
      completed: i < 7
    })),
    attachments: [],
    comments: [],
    isCompleted: false,
    createdAt: '2025-08-05',
    order: 2
  },
  {
    id: 'task-9',
    boardId: 'board-1',
    title: 'Create the Email Page layout and necessary components',
    description: 'Email templates, inbox list component, and rich text editor integration.',
    columnId: 'done',
    label: 'Feature',
    priority: 'Medium',
    dueDate: '2025-08-05',
    assignees: ['user-2', 'user-4'],
    subtasks: [
      { id: 'st-9-1', title: 'Email list view', completed: true },
      { id: 'st-9-2', title: 'Compose modal', completed: true }
    ],
    attachments: [],
    comments: Array.from({ length: 43 }, (_, i) => ({
      id: `c-9-${i}`,
      userId: 'user-2',
      text: `Approved design ${i + 1}`,
      createdAt: '2025-08-04'
    })),
    isCompleted: true,
    createdAt: '2025-08-01',
    order: 1
  },
  {
    id: 'task-10',
    boardId: 'board-1',
    title: 'Enhance website usability through user feedback',
    description: 'Implement UX tweaks, improve mobile touch targets, and optimize loading indicators.',
    columnId: 'done',
    label: 'Feature',
    priority: 'Low',
    dueDate: '2025-08-07',
    assignees: ['user-3', 'user-4'],
    subtasks: [],
    attachments: [],
    comments: Array.from({ length: 14 }, (_, i) => ({
      id: `c-10-${i}`,
      userId: 'user-3',
      text: `Usability metric test ${i + 1}`,
      createdAt: '2025-08-06'
    })),
    isCompleted: true,
    createdAt: '2025-08-02',
    order: 2
  },
  {
    id: 'task-11',
    boardId: 'board-1',
    title: 'Kitchen & Workspace UI Module',
    description: 'Interactive 3D model viewer integration for interior product catalog.',
    columnId: 'done',
    label: 'Feature',
    priority: 'Medium',
    dueDate: '2025-08-10',
    assignees: ['user-1', 'user-5'],
    subtasks: [],
    attachments: [],
    comments: [],
    coverImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    isCompleted: true,
    createdAt: '2025-08-03',
    order: 3
  },
  {
    id: 'task-12',
    boardId: 'board-1',
    title: 'Blog Edit Page Modification and Playlist Page Design',
    description: 'Modify blog post editor layout and add audio playlist management controls.',
    columnId: 'rework',
    label: 'Feature',
    priority: 'High',
    dueDate: '2025-08-08',
    assignees: ['user-2', 'user-4'],
    subtasks: Array.from({ length: 22 }, (_, i) => ({
      id: `st-12-${i}`,
      title: `Rework checklist item ${i + 1}`,
      completed: i < 7
    })),
    attachments: [],
    comments: Array.from({ length: 40 }, (_, i) => ({
      id: `c-12-${i}`,
      userId: 'user-4',
      text: `Client requested change ${i + 1}`,
      createdAt: '2025-08-07'
    })),
    isCompleted: false,
    createdAt: '2025-08-04',
    order: 1
  },
  {
    id: 'task-13',
    boardId: 'board-1',
    title: 'Plan and execute training sessions for new hires',
    description: 'Prepare onboarding documentation, recorded video guides, and code standards review.',
    columnId: 'rework',
    label: 'Issue',
    priority: 'Urgent',
    dueDate: '2025-08-09',
    assignees: ['user-1', 'user-4'],
    subtasks: Array.from({ length: 19 }, (_, i) => ({
      id: `st-13-${i}`,
      title: `Training task #${i + 1}`,
      completed: i < 5
    })),
    attachments: [],
    comments: [],
    coverImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80',
    isCompleted: false,
    createdAt: '2025-08-05',
    order: 2
  },

  // Board 2: Northern Light Tasks
  {
    id: 'task-nl-1',
    boardId: 'board-2',
    title: 'Design Northern Light Mobile App UI Kit',
    description: 'Build core design system, component tokens, dark theme variations, and icon set for Northern Light.',
    columnId: 'doing',
    label: 'Feature',
    priority: 'High',
    dueDate: '2025-09-15',
    assignees: ['user-2', 'user-5'],
    subtasks: [
      { id: 'st-nl-1', title: 'Color Palette Tokens', completed: true },
      { id: 'st-nl-2', title: 'Component Library', completed: false }
    ],
    attachments: [],
    comments: [
      { id: 'c-nl-1', userId: 'user-2', text: 'Initial design spec completed', createdAt: '2025-08-10' }
    ],
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    isCompleted: false,
    createdAt: '2025-08-10',
    order: 1
  },
  {
    id: 'task-nl-2',
    boardId: 'board-2',
    title: 'Implement GraphQL API Gateway',
    description: 'Consolidate REST microservices into a single unified GraphQL schema with subscription support.',
    columnId: 'to-do',
    label: 'Feature',
    priority: 'Urgent',
    dueDate: '2025-09-20',
    assignees: ['user-1', 'user-3'],
    subtasks: [],
    attachments: [],
    comments: [],
    isCompleted: false,
    createdAt: '2025-08-11',
    order: 1
  },
  {
    id: 'task-nl-3',
    boardId: 'board-2',
    title: 'Audit Northern Light Security & Auth Flow',
    description: 'OAuth2 / OIDC token refresh vulnerability analysis and session expiration handling.',
    columnId: 'review',
    label: 'Bug',
    priority: 'High',
    dueDate: '2025-09-10',
    assignees: ['user-3', 'user-4'],
    subtasks: [],
    attachments: [],
    comments: [],
    isCompleted: false,
    createdAt: '2025-08-12',
    order: 1
  },

  // Board 3: Marketing Campaign Tasks
  {
    id: 'task-mc-1',
    boardId: 'board-3',
    title: 'Q4 Product Launch Email Blast Template',
    description: 'Responsive HTML email newsletter design for holiday seasonal promotion campaign.',
    columnId: 'doing',
    label: 'Feature',
    priority: 'High',
    dueDate: '2025-09-25',
    assignees: ['user-2', 'user-4'],
    subtasks: [
      { id: 'st-mc-1', title: 'Copywriting Approval', completed: true },
      { id: 'st-mc-2', title: 'Litmus Email Testing', completed: false }
    ],
    attachments: [],
    comments: [],
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    isCompleted: false,
    createdAt: '2025-08-14',
    order: 1
  },
  {
    id: 'task-mc-2',
    boardId: 'board-3',
    title: 'Google Ads & Retargeting Banner Set',
    description: 'Export banner variations across display sizes: 300x250, 728x90, 160x600, and mobile banners.',
    columnId: 'to-do',
    label: 'Feature',
    priority: 'Medium',
    dueDate: '2025-09-30',
    assignees: ['user-1', 'user-5'],
    subtasks: [],
    attachments: [],
    comments: [],
    isCompleted: false,
    createdAt: '2025-08-15',
    order: 1
  },
  {
    id: 'task-mc-3',
    boardId: 'board-3',
    title: 'SEO Audit & Landing Page Speed Optimization',
    description: 'Optimize Web Vitals (LCP, CLS, FID) to achieve 95+ score on PageSpeed Insights.',
    columnId: 'done',
    label: 'Issue',
    priority: 'Medium',
    dueDate: '2025-09-01',
    assignees: ['user-3'],
    subtasks: [],
    attachments: [],
    comments: [],
    isCompleted: true,
    createdAt: '2025-08-16',
    order: 1
  }
];
