<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in store.toasts" 
        :key="toast.id" 
        :class="['toast-item', toast.type]"
      >
        <div class="toast-icon">
          <CheckCircle2 v-if="toast.type === 'success'" :size="18" />
          <Info v-else-if="toast.type === 'info'" :size="18" />
          <AlertTriangle v-else-if="toast.type === 'warning'" :size="18" />
          <XCircle v-else :size="18" />
        </div>
        <div class="toast-message">{{ toast.message }}</div>
        <button class="toast-close" @click="store.removeToast(toast.id)">
          <X :size="14" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useKanbanStore } from '../stores/kanbanStore';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-vue-next';

const store = useKanbanStore();
</script>
