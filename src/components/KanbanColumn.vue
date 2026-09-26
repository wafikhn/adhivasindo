<template>
  <div 
    class="kanban-column"
    :class="{ 'drag-over': isDragOver }"
    @dragover.prevent="onDragOver"
    @dragenter.prevent="isDragOver = true"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <!-- Column Header -->
    <div class="column-header">
      <div class="column-title-group">
        <span class="column-dot" :style="{ background: column.color }"></span>
        <h2 class="column-title">{{ column.title }}</h2>
        <button class="add-inline-btn" title="Add Task" @click="toggleQuickAdd">
          <Plus :size="16" />
        </button>
      </div>

      <div class="header-right-actions" ref="menuRef">
        <button class="btn-icon column-menu-btn" @click="showMenu = !showMenu">
          <MoreVertical :size="16" />
        </button>

        <!-- Column Dropdown Menu -->
        <div v-if="showMenu" class="column-dropdown-menu animate-slide-up">
          <button class="menu-item" @click="startRename">
            <Edit3 :size="14" /> Rename Column
          </button>
          <button class="menu-item" @click="clearCompleted">
            <CheckCircle :size="14" /> Clear Completed Tasks
          </button>
          <div class="menu-divider"></div>
          <button class="menu-item danger" @click="deleteColumn">
            <Trash2 :size="14" /> Delete Column
          </button>
        </div>
      </div>
    </div>

    <!-- Rename Column Inline Form -->
    <div v-if="isEditingTitle" class="rename-box">
      <input 
        type="text" 
        v-model="editedTitle" 
        ref="titleInputRef" 
        @keyup.enter="saveColumnTitle" 
        @blur="saveColumnTitle"
      />
    </div>

    <!-- Cards List Container -->
    <div class="column-cards-list">
      <TaskCard 
        v-for="task in tasks" 
        :key="task.id" 
        :task="task" 
      />

      <!-- Quick Add Card Form -->
      <div v-if="showQuickAdd" class="quick-add-card animate-slide-up">
        <textarea 
          v-model="quickTaskTitle" 
          placeholder="Enter task title..." 
          rows="2"
          ref="quickAddTextareaRef"
          @keyup.enter.exact.prevent="createQuickTask"
        ></textarea>
        <div class="quick-add-actions">
          <button class="btn btn-secondary btn-sm" @click="showQuickAdd = false">Cancel</button>
          <button class="btn btn-primary btn-sm" @click="createQuickTask">Add Card</button>
        </div>
      </div>

      <!-- Drop zone placeholder when empty -->
      <div v-if="tasks.length === 0 && !showQuickAdd" class="empty-column-placeholder">
        <span>No tasks in {{ column.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import { Column, Task } from '../types/kanban';
import { useKanbanStore } from '../stores/kanbanStore';
import TaskCard from './TaskCard.vue';
import { Plus, MoreVertical, Edit3, CheckCircle, Trash2 } from 'lucide-vue-next';

const props = defineProps<{
  column: Column;
  tasks: Task[];
}>();

const store = useKanbanStore();

const isDragOver = ref(false);
const showMenu = ref(false);
const isEditingTitle = ref(false);
const editedTitle = ref(props.column.title);
const titleInputRef = ref<HTMLInputElement | null>(null);

const showQuickAdd = ref(false);
const quickTaskTitle = ref('');
const quickAddTextareaRef = ref<HTMLTextAreaElement | null>(null);

const menuRef = ref<HTMLElement | null>(null);

function onDragOver(e: DragEvent) {
  isDragOver.value = true;
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move';
  }
}

function onDragLeave(e: DragEvent) {
  const relatedTarget = e.relatedTarget as Node;
  const currentTarget = e.currentTarget as Node;
  if (currentTarget && !currentTarget.contains(relatedTarget)) {
    isDragOver.value = false;
  }
}

function onDrop(e: DragEvent) {
  isDragOver.value = false;
  const taskId = store.draggedTaskId || e.dataTransfer?.getData('text/plain');
  if (taskId) {
    store.moveTask(taskId, props.column.id);
  }
}

function toggleQuickAdd() {
  showQuickAdd.value = !showQuickAdd.value;
  if (showQuickAdd.value) {
    nextTick(() => {
      quickAddTextareaRef.value?.focus();
    });
  }
}

function createQuickTask() {
  if (quickTaskTitle.value.trim()) {
    store.createTask({
      title: quickTaskTitle.value.trim(),
      columnId: props.column.id
    });
    quickTaskTitle.value = '';
    showQuickAdd.value = false;
  }
}

function startRename() {
  isEditingTitle.value = true;
  showMenu.value = false;
  nextTick(() => {
    titleInputRef.value?.focus();
  });
}

function saveColumnTitle() {
  if (editedTitle.value.trim() && editedTitle.value !== props.column.title) {
    store.updateColumn(props.column.id, editedTitle.value.trim());
  }
  isEditingTitle.value = false;
}

function clearCompleted() {
  const completed = props.tasks.filter(t => t.isCompleted);
  if (completed.length === 0) {
    store.addToast('info', 'No completed tasks to clear');
  } else {
    completed.forEach(t => store.deleteTask(t.id));
  }
  showMenu.value = false;
}

function deleteColumn() {
  if (confirm(`Delete column "${props.column.title}" and all its tasks?`)) {
    store.deleteColumn(props.column.id);
  }
  showMenu.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    showMenu.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
