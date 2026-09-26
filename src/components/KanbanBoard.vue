<template>
  <div class="board-container">
    <div class="columns-scroll-area">
      <!-- Active Columns -->
      <KanbanColumn 
        v-for="col in store.columns" 
        :key="col.id" 
        :column="col"
        :tasks="store.getTasksByColumn(col.id)"
      />

      <!-- Add New List Column Card -->
      <div class="add-column-card">
        <div v-if="!showAddColumn" class="add-column-trigger" @click="showAddColumn = true">
          <Plus :size="18" />
          <span>Add new List</span>
        </div>

        <div v-else class="add-column-form animate-slide-up">
          <input 
            type="text" 
            v-model="newColumnTitle" 
            placeholder="Enter list title..." 
            ref="colInputRef"
            @keyup.enter="createColumn"
          />
          <div class="add-col-actions">
            <button class="btn btn-secondary btn-sm" @click="showAddColumn = false">Cancel</button>
            <button class="btn btn-primary btn-sm" @click="createColumn">Add List</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { useKanbanStore } from '../stores/kanbanStore';
import KanbanColumn from './KanbanColumn.vue';
import { Plus } from 'lucide-vue-next';

const store = useKanbanStore();
const showAddColumn = ref(false);
const newColumnTitle = ref('');
const colInputRef = ref<HTMLInputElement | null>(null);

watch(showAddColumn, (val) => {
  if (val) {
    nextTick(() => {
      colInputRef.value?.focus();
    });
  }
});

function createColumn() {
  if (newColumnTitle.value.trim()) {
    store.createColumn(newColumnTitle.value.trim());
    newColumnTitle.value = '';
    showAddColumn.value = false;
  }
}
</script>
