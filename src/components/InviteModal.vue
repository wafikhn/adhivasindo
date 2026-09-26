<template>
  <div v-if="show" class="modal-backdrop" @click.self="$emit('close')">
    <div class="invite-modal-card animate-slide-up">
      <div class="modal-header">
        <h3>Invite Team Members</h3>
        <button class="close-btn" @click="$emit('close')"><X :size="18" /></button>
      </div>

      <div class="modal-body">
        <p class="invite-desc">Invite colleagues to collaborate on <strong>{{ store.activeBoard?.title }}</strong>.</p>
        
        <div class="input-group">
          <input 
            type="text" 
            v-model="name" 
            placeholder="Full Name (e.g. Jessica Taylor)" 
            class="invite-input"
          />
        </div>

        <div class="input-group">
          <input 
            type="text" 
            v-model="avatarUrl" 
            placeholder="Avatar Image URL (optional)" 
            class="invite-input"
          />
        </div>

        <div class="preset-avatars">
          <span class="preset-label">Or pick a standard avatar:</span>
          <div class="avatars-row">
            <img 
              v-for="(url, idx) in defaultAvatars" 
              :key="idx" 
              :src="url" 
              :class="['preset-img', { selected: avatarUrl === url }]"
              @click="avatarUrl = url" 
            />
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">Cancel</button>
        <button class="btn btn-primary" @click="addMember">Invite Member</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useKanbanStore } from '../stores/kanbanStore';
import { X } from 'lucide-vue-next';

defineProps<{ show: boolean }>();
const emit = defineEmits(['close']);
const store = useKanbanStore();

const name = ref('');
const avatarUrl = ref('');

const defaultAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
];

function addMember() {
  if (name.value.trim()) {
    const newMember = {
      id: 'user-' + Date.now(),
      name: name.value.trim(),
      avatar: avatarUrl.value.trim() || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)],
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    store.users.push(newMember);
    store.saveToLocalStorage();
    store.addToast('success', `${newMember.name} joined the board`);
    name.value = '';
    avatarUrl.value = '';
    emit('close');
  }
}
</script>
