<template>
  <div class="app-layout">
    <!-- Main Top Header -->
    <Header 
      @open-invite="showInviteModal = true"
      @open-create-task="openCreateTask"
    />

    <!-- Main Board Area -->
    <main class="main-content">
      <KanbanBoard />
    </main>

    <!-- Task Detail & CRUD Modal -->
    <TaskModal />

    <!-- Invite Team Modal -->
    <InviteModal 
      :show="showInviteModal" 
      @close="showInviteModal = false" 
    />

    <!-- Floating Toast Notifications Container -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Header from './components/Header.vue';
import KanbanBoard from './components/KanbanBoard.vue';
import TaskModal from './components/TaskModal.vue';
import InviteModal from './components/InviteModal.vue';
import ToastContainer from './components/ToastContainer.vue';
import { useKanbanStore } from './stores/kanbanStore';

const store = useKanbanStore();
const showInviteModal = ref(false);

function openCreateTask() {
  const newTask = store.createTask({
    title: 'New Task',
    columnId: 'to-do',
    label: 'Feature',
    priority: 'Medium'
  });
  store.openTaskDetail(newTask.id);
}
</script>
