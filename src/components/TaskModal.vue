<template>
  <div v-if="task" class="modal-backdrop" @click.self="closeModal">
    <div class="task-modal-card animate-slide-up">
      <!-- Top Action Bar -->
      <div class="modal-top-bar">
        <button 
          :class="['btn-mark-complete', { 'completed': form.isCompleted }]"
          @click="toggleComplete"
        >
          <Check :size="16" />
          <span>{{ form.isCompleted ? 'Completed' : 'Mark Complete' }}</span>
        </button>

        <button class="modal-close-btn" @click="closeModal">
          <X :size="20" />
        </button>
      </div>

      <!-- Cover Image Banner / Dropzone -->
      <div class="cover-image-container">
        <div v-if="form.coverImage" class="cover-image-preview">
          <img :src="form.coverImage" alt="Cover" />
          <div class="cover-overlay-actions">
            <button class="cover-btn" @click="showCoverPicker = !showCoverPicker">
              <Image :size="14" /> Change Cover
            </button>
            <button class="cover-btn danger" @click="form.coverImage = ''">
              <Trash2 :size="14" /> Remove
            </button>
          </div>
        </div>

        <div v-else class="add-cover-placeholder" @click="showCoverPicker = !showCoverPicker">
          <ImageIcon :size="24" />
          <span>Add Cover Image</span>
        </div>

        <!-- Cover Image Preset Picker Dropdown -->
        <div v-if="showCoverPicker" class="cover-picker-panel animate-slide-up">
          <div class="picker-header">
            <span>Select Cover Image</span>
            <button class="close-picker" @click="showCoverPicker = false"><X :size="14" /></button>
          </div>
          <div class="preset-images-grid">
            <div 
              v-for="(imgUrl, i) in presetCovers" 
              :key="i" 
              class="preset-thumb"
              @click="selectCover(imgUrl)"
            >
              <img :src="imgUrl" alt="Preset cover" />
            </div>
          </div>
          <div class="custom-url-input">
            <input 
              type="text" 
              v-model="customCoverUrl" 
              placeholder="Or paste image URL..." 
              @keyup.enter="applyCustomCover"
            />
            <button class="btn btn-primary btn-sm" @click="applyCustomCover">Apply</button>
          </div>
        </div>
      </div>

      <!-- Modal Body Content -->
      <div class="modal-body">
        <div class="body-grid">
          <!-- Left Column: Primary Details -->
          <div class="grid-main">
            <!-- Editable Title -->
            <div class="title-section">
              <input 
                type="text" 
                v-model="form.title" 
                class="title-input" 
                placeholder="Task Title..."
              />
              <Edit3 :size="16" class="title-edit-icon" />
            </div>

            <!-- Metadata Properties Grid (Page 3 layout) -->
            <div class="properties-grid">
              <!-- Assignees Property -->
              <div class="property-item">
                <label>Assignee</label>
                <div class="assignee-select-container">
                  <div class="assignees-list">
                    <div 
                      v-for="user in selectedAssigneeUsers" 
                      :key="user.id" 
                      class="assignee-chip"
                      :title="user.name"
                    >
                      <img :src="user.avatar" :alt="user.name" />
                    </div>
                  </div>
                  <button class="add-assignee-btn" @click="showAssigneeDropdown = !showAssigneeDropdown">
                    <Plus :size="14" />
                  </button>

                  <div v-if="showAssigneeDropdown" class="assignee-dropdown-menu animate-slide-up">
                    <div 
                      v-for="user in store.users" 
                      :key="user.id" 
                      class="user-select-row"
                      @click="toggleAssignee(user.id)"
                    >
                      <img :src="user.avatar" class="mini-avatar" />
                      <span>{{ user.name }}</span>
                      <Check v-if="form.assignees.includes(user.id)" :size="14" class="check-icon" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Due Date Property -->
              <div class="property-item">
                <label>Due Date</label>
                <div class="input-with-icon">
                  <input type="date" v-model="form.dueDate" class="property-input" />
                  <Calendar :size="16" class="field-icon" />
                </div>
              </div>

              <!-- Board Property -->
              <div class="property-item">
                <label>Board</label>
                <select v-model="selectedBoardId" class="property-select">
                  <option v-for="b in store.boards" :key="b.id" :value="b.id">
                    {{ b.title }}
                  </option>
                </select>
              </div>

              <!-- Column Property -->
              <div class="property-item">
                <label>Column</label>
                <select v-model="form.columnId" class="property-select">
                  <option v-for="col in store.columns" :key="col.id" :value="col.id">
                    {{ col.title }}
                  </option>
                </select>
              </div>

              <!-- Label Property -->
              <div class="property-item">
                <label>Label</label>
                <select v-model="form.label" class="property-select">
                  <option value="Feature">Feature</option>
                  <option value="Bug">Bug</option>
                  <option value="Issue">Issue</option>
                  <option value="Undefined">Undefined</option>
                </select>
              </div>

              <!-- Priority Property -->
              <div class="property-item">
                <label>Priority</label>
                <select v-model="form.priority" class="property-select">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <!-- Description Section -->
            <div class="section-block">
              <div class="section-title">
                <span>Description</span>
                <Edit3 :size="14" />
              </div>
              <textarea 
                v-model="form.description" 
                placeholder="Add a more detailed description..."
                rows="4"
                class="description-textarea"
              ></textarea>
            </div>
          </div>

          <!-- Right Column: Subtasks, Attachments & Activity -->
          <div class="grid-side">
            <!-- Attachments Section -->
            <div class="section-block">
              <div class="section-title">
                <span>Attachments</span>
                <Paperclip :size="14" />
              </div>

              <!-- Dropzone -->
              <label class="dropzone-box">
                <UploadCloud :size="20" />
                <span>Drag & Drop files here or <span class="browse-link">browse from device</span></span>
                <input type="file" multiple class="hidden-input" @change="handleFileUpload" />
              </label>

              <!-- Attachments List -->
              <div v-if="task.attachments.length > 0" class="attachments-list">
                <div v-for="att in task.attachments" :key="att.id" class="attachment-item">
                  <FileText :size="16" class="file-icon" />
                  <div class="file-info">
                    <span class="file-name">{{ att.name }}</span>
                    <span class="file-size">{{ att.size }}</span>
                  </div>
                  <button class="remove-file-btn" @click="store.deleteAttachment(task.id, att.id)">
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Check List (Subtask) Section -->
            <div class="section-block">
              <div class="section-title space-between">
                <span>Check List</span>
                <span class="checklist-count">{{ completedSubtaskCount }}/{{ totalSubtaskCount }}</span>
              </div>

              <!-- Progress bar -->
              <div class="subtask-progress-bar">
                <div 
                  class="subtask-progress-fill" 
                  :style="{ width: subtaskProgressPercent + '%' }"
                ></div>
              </div>

              <!-- Subtasks Items List -->
              <div class="subtasks-list">
                <div v-for="st in task.subtasks" :key="st.id" class="subtask-item">
                  <input 
                    type="checkbox" 
                    :checked="st.completed" 
                    @change="store.toggleSubtask(task.id, st.id)" 
                  />
                  <span :class="['subtask-title', { completed: st.completed }]">{{ st.title }}</span>
                  <button class="delete-st-btn" @click="store.deleteSubtask(task.id, st.id)">
                    <X :size="14" />
                  </button>
                </div>
              </div>

              <!-- Add Subtask Input -->
              <div class="add-subtask-box">
                <input 
                  type="text" 
                  v-model="newSubtaskTitle" 
                  placeholder="+ Add subtask" 
                  @keyup.enter="addNewSubtask"
                />
                <button v-if="newSubtaskTitle" class="btn btn-primary btn-sm" @click="addNewSubtask">Add</button>
              </div>
            </div>

            <!-- Activity & Comments Section -->
            <div class="section-block">
              <div class="section-title">
                <span>Activity</span>
                <MessageSquare :size="14" />
              </div>

              <!-- Comment Input -->
              <div class="comment-input-box">
                <input 
                  type="text" 
                  v-model="newCommentText" 
                  placeholder="Write a comment..." 
                  @keyup.enter="addComment"
                />
                <button v-if="newCommentText" class="btn btn-primary btn-sm" @click="addComment">Post</button>
              </div>

              <!-- Comments List -->
              <div v-if="task.comments.length > 0" class="comments-list">
                <div v-for="c in task.comments.slice(-4)" :key="c.id" class="comment-item">
                  <img :src="getCommentUser(c.userId)?.avatar" class="comment-avatar" />
                  <div class="comment-content">
                    <div class="comment-header">
                      <span class="user-name">{{ getCommentUser(c.userId)?.name }}</span>
                      <span class="comment-date">{{ c.createdAt }}</span>
                    </div>
                    <p class="comment-text">{{ c.text }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button class="btn-delete-task" @click="deleteCurrentTask">
          <Trash2 :size="16" />
          <span>Delete Task</span>
        </button>

        <div class="footer-right-buttons">
          <button class="btn btn-secondary" @click="closeModal">Discard</button>
          <button class="btn btn-primary" @click="saveTask">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useKanbanStore } from '../stores/kanbanStore';
import { User } from '../types/kanban';
import confetti from 'canvas-confetti';
import { 
  Check, X, Image as ImageIcon, Image, Trash2, Edit3, Plus, 
  Calendar, Paperclip, UploadCloud, FileText, MessageSquare 
} from 'lucide-vue-next';

const store = useKanbanStore();

const task = computed(() => store.selectedTask);
const selectedBoardId = ref(store.activeBoardId);

const form = ref({
  title: '',
  description: '',
  columnId: 'to-do',
  label: 'Feature' as any,
  priority: 'Medium' as any,
  dueDate: '',
  assignees: [] as string[],
  coverImage: '',
  isCompleted: false
});

const showCoverPicker = ref(false);
const customCoverUrl = ref('');
const showAssigneeDropdown = ref(false);
const newSubtaskTitle = ref('');
const newCommentText = ref('');

const presetCovers = [
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80'
];

watch(task, (newTask) => {
  if (newTask) {
    selectedBoardId.value = newTask.boardId || store.activeBoardId;
    form.value = {
      title: newTask.title,
      description: newTask.description,
      columnId: newTask.columnId,
      label: newTask.label,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      assignees: [...newTask.assignees],
      coverImage: newTask.coverImage || '',
      isCompleted: newTask.isCompleted
    };
  }
}, { immediate: true });

const selectedAssigneeUsers = computed<User[]>(() => {
  return form.value.assignees
    .map(id => store.getUserById(id))
    .filter((u): u is User => !!u);
});

const totalSubtaskCount = computed(() => task.value?.subtasks.length || 0);
const completedSubtaskCount = computed(() => task.value?.subtasks.filter(s => s.completed).length || 0);

const subtaskProgressPercent = computed(() => {
  if (totalSubtaskCount.value === 0) return 0;
  return Math.round((completedSubtaskCount.value / totalSubtaskCount.value) * 100);
});

function toggleComplete() {
  form.value.isCompleted = !form.value.isCompleted;
  if (form.value.isCompleted) {
    form.value.columnId = 'done';
    triggerConfetti();
  }
}

function triggerConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function toggleAssignee(userId: string) {
  if (form.value.assignees.includes(userId)) {
    form.value.assignees = form.value.assignees.filter(id => id !== userId);
  } else {
    form.value.assignees.push(userId);
  }
}

function selectCover(url: string) {
  form.value.coverImage = url;
  showCoverPicker.value = false;
}

function applyCustomCover() {
  if (customCoverUrl.value.trim()) {
    form.value.coverImage = customCoverUrl.value.trim();
    customCoverUrl.value = '';
    showCoverPicker.value = false;
  }
}

function addNewSubtask() {
  if (task.value && newSubtaskTitle.value.trim()) {
    store.addSubtask(task.value.id, newSubtaskTitle.value);
    newSubtaskTitle.value = '';
  }
}

function addComment() {
  if (task.value && newCommentText.value.trim()) {
    store.addComment(task.value.id, newCommentText.value);
    newCommentText.value = '';
  }
}

function handleFileUpload(e: Event) {
  const input = e.target as HTMLInputElement;
  if (task.value && input.files) {
    Array.from(input.files).forEach(file => {
      const fileSize = (file.size / 1024).toFixed(1) + ' KB';
      const fileUrl = URL.createObjectURL(file);
      store.addAttachment(task.value!.id, {
        name: file.name,
        url: fileUrl,
        size: fileSize,
        type: file.type
      });
    });
  }
}

function getCommentUser(userId: string) {
  return store.getUserById(userId);
}

function saveTask() {
  if (task.value) {
    store.updateTask(task.value.id, {
      boardId: selectedBoardId.value,
      title: form.value.title,
      description: form.value.description,
      columnId: form.value.columnId,
      label: form.value.label,
      priority: form.value.priority,
      dueDate: form.value.dueDate,
      assignees: form.value.assignees,
      coverImage: form.value.coverImage,
      isCompleted: form.value.isCompleted
    });
    closeModal();
  }
}

function deleteCurrentTask() {
  if (task.value && confirm(`Are you sure you want to delete "${task.value.title}"?`)) {
    store.deleteTask(task.value.id);
  }
}

function closeModal() {
  store.closeTaskDetail();
}
</script>
