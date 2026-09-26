<template>
  <header class="app-header">
    <div class="header-left">
      <!-- Logo & Board Select Dropdown -->
      <div class="board-dropdown-wrapper" ref="dropdownRef">
        <button class="board-select-btn" @click="toggleBoardMenu">
          <div class="brand-logo">
            <svg viewBox="0 0 100 100" class="logo-svg">
              <path d="M20 70 C20 30, 50 10, 80 10 C60 40, 50 80, 20 70 Z" fill="#0284C7" />
              <path d="M30 85 C40 50, 70 30, 90 25 C75 60, 60 90, 30 85 Z" fill="#0D9488" />
            </svg>
          </div>
          <span class="board-title">{{ store.activeBoard?.title || 'Adhivasindo' }}</span>
          <ChevronDown :size="16" class="dropdown-chevron" />
        </button>

        <div v-if="showBoardMenu" class="board-menu-dropdown animate-slide-up">
          <div class="menu-header">Select Board</div>
          <button 
            v-for="board in store.boards" 
            :key="board.id" 
            :class="['board-option', { active: board.id === store.activeBoardId }]"
            @click="selectBoard(board.id)"
          >
            <span>{{ board.title }}</span>
            <Check v-if="board.id === store.activeBoardId" :size="14" />
          </button>
          <div class="menu-divider"></div>
          <button class="add-board-btn" @click="showAddBoardModal = true">
            <Plus :size="14" /> Add New Board
          </button>
        </div>
      </div>

      <!-- Team Members Avatar Stack -->
      <div class="team-avatars">
        <div 
          v-for="(user, index) in store.users.slice(0, 3)" 
          :key="user.id" 
          class="avatar-item"
          :title="user.name"
          :style="{ zIndex: 10 - index }"
        >
          <img :src="user.avatar" :alt="user.name" />
        </div>
        <div v-if="store.users.length > 3" class="avatar-more">
          +{{ store.users.length - 3 }}
        </div>

        <button class="invite-btn" @click="$emit('open-invite')">
          <UserPlus :size="14" />
          <span>Invite</span>
        </button>
      </div>
    </div>

    <!-- Header Actions Right -->
    <div class="header-right">
      <!-- Filter Toggle Button -->
      <div class="filter-dropdown-wrapper" ref="filterRef">
        <button 
          :class="['action-btn', { active: isFilterActive }]" 
          @click="toggleFilterMenu"
        >
          <SlidersHorizontal :size="16" />
          <span>Filter</span>
          <span v-if="activeFilterCount > 0" class="filter-badge">{{ activeFilterCount }}</span>
        </button>

        <!-- Filter Menu Panel -->
        <div v-if="showFilterMenu" class="filter-menu-panel animate-slide-up">
          <div class="filter-panel-header">
            <h4>Filter Tasks</h4>
            <button class="reset-filter-btn" @click="resetFilters">Reset</button>
          </div>

          <div class="filter-group">
            <label>Assignee</label>
            <select :value="store.filters.assigneeId" @change="e => updateFilter('assigneeId', (e.target as HTMLSelectElement).value)">
              <option value="">All Assignees</option>
              <option v-for="user in store.users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label>Label</label>
            <select :value="store.filters.label" @change="e => updateFilter('label', (e.target as HTMLSelectElement).value)">
              <option value="">All Labels</option>
              <option value="Feature">Feature</option>
              <option value="Bug">Bug</option>
              <option value="Issue">Issue</option>
              <option value="Undefined">Undefined</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Priority</label>
            <select :value="store.filters.priority" @change="e => updateFilter('priority', (e.target as HTMLSelectElement).value)">
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Due Date Status</label>
            <select :value="store.filters.dueDate" @change="e => updateFilter('dueDate', (e.target as HTMLSelectElement).value)">
              <option value="">Any Date</option>
              <option value="due-soon">Due Soon / Upcoming</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Export / Import & Reset -->
      <div class="data-actions-wrapper" ref="dataActionsRef">
        <button class="action-btn" @click="toggleDataMenu">
          <Download :size="16" />
          <span>Export / Import</span>
        </button>

        <div v-if="showDataMenu" class="data-menu-panel animate-slide-up">
          <button class="data-option" @click="exportJSON">
            <Download :size="14" /> Export Board JSON
          </button>
          <label class="data-option file-label">
            <Upload :size="14" /> Import Board JSON
            <input type="file" accept=".json" class="hidden-input" @change="handleImportFile" />
          </label>
          <div class="menu-divider"></div>
          <button class="data-option danger" @click="resetData">
            <RotateCcw :size="14" /> Reset Sample Data
          </button>
        </div>
      </div>

      <!-- Search Tasks Bar -->
      <div class="search-box">
        <Search :size="16" class="search-icon" />
        <input 
          type="text" 
          placeholder="Search Tasks" 
          :value="store.filters.searchQuery"
          @input="e => store.setFilters({ searchQuery: (e.target as HTMLInputElement).value })"
        />
        <button 
          v-if="store.filters.searchQuery" 
          class="clear-search-btn"
          @click="store.setFilters({ searchQuery: '' })"
        >
          <X :size="14" />
        </button>
      </div>

      <!-- Create Task Button -->
      <button class="btn btn-primary create-task-btn" @click="$emit('open-create-task')">
        <Plus :size="16" />
        <span>New Task</span>
      </button>
    </div>

    <!-- Modal for Adding Board -->
    <div v-if="showAddBoardModal" class="modal-backdrop" @click.self="showAddBoardModal = false">
      <div class="add-board-card animate-slide-up">
        <h3>Create New Board</h3>
        <input 
          type="text" 
          v-model="newBoardTitle" 
          placeholder="Board Name (e.g. Mobile App Revamp)" 
          class="board-input"
          @keyup.enter="createNewBoard"
        />
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showAddBoardModal = false">Cancel</button>
          <button class="btn btn-primary" @click="createNewBoard">Create Board</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useKanbanStore } from '../stores/kanbanStore';
import { 
  ChevronDown, Plus, UserPlus, SlidersHorizontal, Download, Upload, 
  Search, X, Check, RotateCcw 
} from 'lucide-vue-next';

const emit = defineEmits(['open-invite', 'open-create-task']);
const store = useKanbanStore();

const showBoardMenu = ref(false);
const showFilterMenu = ref(false);
const showDataMenu = ref(false);
const showAddBoardModal = ref(false);
const newBoardTitle = ref('');

const dropdownRef = ref<HTMLElement | null>(null);
const filterRef = ref<HTMLElement | null>(null);
const dataActionsRef = ref<HTMLElement | null>(null);

const activeFilterCount = computed(() => {
  let count = 0;
  if (store.filters.assigneeId) count++;
  if (store.filters.label) count++;
  if (store.filters.priority) count++;
  if (store.filters.dueDate) count++;
  return count;
});

const isFilterActive = computed(() => activeFilterCount.value > 0);

function toggleBoardMenu() {
  showBoardMenu.value = !showBoardMenu.value;
  showFilterMenu.value = false;
  showDataMenu.value = false;
}

function toggleFilterMenu() {
  showFilterMenu.value = !showFilterMenu.value;
  showBoardMenu.value = false;
  showDataMenu.value = false;
}

function toggleDataMenu() {
  showDataMenu.value = !showDataMenu.value;
  showBoardMenu.value = false;
  showFilterMenu.value = false;
}

function selectBoard(id: string) {
  store.selectBoard(id);
  showBoardMenu.value = false;
}

function createNewBoard() {
  if (newBoardTitle.value.trim()) {
    const newBoard = {
      id: 'board-' + Date.now(),
      title: newBoardTitle.value.trim()
    };
    store.boards.push(newBoard);
    store.selectBoard(newBoard.id);
    store.saveToLocalStorage();
    store.addToast('success', `Board "${newBoard.title}" created`);
    newBoardTitle.value = '';
    showAddBoardModal.value = false;
  }
}

function updateFilter(key: string, value: string) {
  store.setFilters({ [key]: value });
}

function resetFilters() {
  store.resetFilters();
}

function exportJSON() {
  store.exportData();
  showDataMenu.value = false;
}

function handleImportFile(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        store.importData(e.target.result as string);
      }
    };
    reader.readAsText(file);
  }
  showDataMenu.value = false;
}

function resetData() {
  if (confirm('Are you sure you want to reset all tasks to initial sample data?')) {
    store.resetToDefaultData();
  }
  showDataMenu.value = false;
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node;
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    showBoardMenu.value = false;
  }
  if (filterRef.value && !filterRef.value.contains(target)) {
    showFilterMenu.value = false;
  }
  if (dataActionsRef.value && !dataActionsRef.value.contains(target)) {
    showDataMenu.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
