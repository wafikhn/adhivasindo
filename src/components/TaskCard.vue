<template>
  <div 
    class="task-card" 
    :class="{ 'has-cover': !!task.coverImage, 'is-completed': task.isCompleted }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @click="openDetail"
  >
    <!-- Task Cover Image -->
    <div v-if="task.coverImage" class="card-cover-image">
      <img :src="task.coverImage" :alt="task.title" loading="lazy" />
    </div>

    <div class="card-content">
      <!-- Label Pill & Priority -->
      <div class="card-top-row">
        <span :class="['label-pill', labelClass]">
          {{ task.label }}
        </span>
        <span v-if="task.priority && task.priority !== 'Medium'" :class="['priority-pill', task.priority]">
          {{ task.priority }}
        </span>
      </div>

      <!-- Subtask Progress Bar -->
      <div v-if="totalSubtasks > 0" class="card-progress-wrapper">
        <div class="card-progress-bar">
          <div 
            class="card-progress-fill" 
            :style="{ width: completedSubtaskPercent + '%' }"
            :class="{ 'complete': completedSubtaskPercent === 100 }"
          ></div>
        </div>
      </div>

      <!-- Task Title -->
      <h3 class="card-title">{{ task.title }}</h3>

      <!-- Card Footer Metadata -->
      <div class="card-footer">
        <div class="meta-left">
          <!-- Due Date Badge -->
          <div 
            v-if="task.dueDate" 
            :class="['meta-item', 'due-date-item', { 'overdue': isOverdue }]"
            :title="'Due date: ' + formattedDate"
          >
            <Clock :size="13" />
            <span>{{ shortDueDate }}</span>
          </div>

          <!-- Checklist Counter -->
          <div 
            v-if="totalSubtasks > 0" 
            class="meta-item checklist-item" 
            :class="{ 'complete': completedSubtasks === totalSubtasks }"
            :title="`${completedSubtasks} of ${totalSubtasks} subtasks completed`"
          >
            <CheckSquare :size="13" />
            <span>{{ completedSubtasks }}/{{ totalSubtasks }}</span>
          </div>

          <!-- Comments & Attachments Counter -->
          <div 
            v-if="totalCommentsOrAttachments > 0" 
            class="meta-item comments-item"
            :title="`${task.comments.length} comments, ${task.attachments.length} attachments`"
          >
            <MessageSquare :size="13" />
            <span>{{ totalCommentsOrAttachments }}</span>
          </div>
        </div>

        <!-- Assignee Avatars Stack -->
        <div v-if="assignedUsers.length > 0" class="assignees-stack">
          <div 
            v-for="(user, idx) in assignedUsers.slice(0, 3)" 
            :key="user.id" 
            class="assignee-avatar"
            :title="user.name"
            :style="{ zIndex: 5 - idx }"
          >
            <img :src="user.avatar" :alt="user.name" />
          </div>
          <div v-if="assignedUsers.length > 3" class="assignee-more">
            +{{ assignedUsers.length - 3 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Task } from '../types/kanban';
import { useKanbanStore } from '../stores/kanbanStore';
import { Clock, CheckSquare, MessageSquare } from 'lucide-vue-next';

const props = defineProps<{
  task: Task;
}>();

const store = useKanbanStore();

const labelClass = computed(() => props.task.label.toLowerCase());

const assignedUsers = computed(() => {
  return props.task.assignees
    .map(id => store.getUserById(id))
    .filter(Boolean) as Array<{ id: string; name: string; avatar: string }>;
});

const totalSubtasks = computed(() => props.task.subtasks?.length || 0);

const completedSubtasks = computed(() => {
  return props.task.subtasks?.filter(s => s.completed).length || 0;
});

const completedSubtaskPercent = computed(() => {
  if (totalSubtasks.value === 0) return 0;
  return Math.round((completedSubtasks.value / totalSubtasks.value) * 100);
});

const totalCommentsOrAttachments = computed(() => {
  return (props.task.comments?.length || 0) + (props.task.attachments?.length || 0);
});

const shortDueDate = computed(() => {
  if (!props.task.dueDate) return '';
  const dateObj = new Date(props.task.dueDate);
  if (isNaN(dateObj.getTime())) return props.task.dueDate;
  
  const day = dateObj.getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[dateObj.getMonth()];
  return `${day} ${month}`;
});

const formattedDate = computed(() => props.task.dueDate);

const isOverdue = computed(() => {
  if (!props.task.dueDate || props.task.isCompleted) return false;
  const today = new Date().toISOString().split('T')[0];
  return props.task.dueDate < today;
});

function openDetail() {
  store.openTaskDetail(props.task.id);
}

function onDragStart(e: DragEvent) {
  store.draggedTaskId = props.task.id;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', props.task.id);
  }
}

function onDragEnd() {
  store.draggedTaskId = null;
}
</script>
