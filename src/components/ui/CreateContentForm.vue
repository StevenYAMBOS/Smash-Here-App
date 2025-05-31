<!-- src/components/ui/CreateContentForm.vue -->

<template>
  <form @submit.prevent="submit" class="create-content-form">
    <div class="field">
      <label for="title">Title</label>
      <input id="title" v-model="title" type="text" placeholder="Enter content title" required />
    </div>

    <div class="field">
      <label for="type">Type</label>
      <select id="type" v-model="type" required>
        <option value="" disabled>Select a type</option>
        <option value="video">Video</option>
        <option value="article">Article</option>
        <option value="page">Page</option>
        <option value="roadmap">Roadmap</option>
      </select>
    </div>

    <div class="field">
      <label for="link">Link</label>
      <input id="link" v-model="link" type="url" placeholder="https://example.com" required />
    </div>

    <SubmitButton label="Save" type="submit" icon="pi-save" iconPosition="left" variant="primary" />
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import SubmitButton from '@/components/ui/SubmitButton.vue'
import { useUserStore } from '@/stores/user'

const toast = useToast()
const loading = ref(false)
const userStore = useUserStore()
const title = ref('')
const type = ref('')
const link = ref('')

async function submit() {
  if (loading.value) return
  loading.value = true
  const payload = {
    title: title.value,
    type: type.value,
    link: link.value,
  }
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/content`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userStore.token}` },

        body: JSON.stringify(payload),
      },
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const newContent = await res.json()
    userStore.contentsCreated.unshift(newContent)
    toast.success('Content created successfully!', { position: 'top-right' })
    // Réinitialisation du formulaire
    title.value = ''
    type.value = ''
    link.value = ''
  } catch (err: any) {
    console.error(err)
    toast.error(err.message || 'Failed to create content', { position: 'top-right' })
  }
}
</script>

<style scoped>
.create-content-form {
  width: 100%;
  background: var(--color-darker-charcoal);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-md);
  max-width: 500px;
  margin: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}
.field {
  margin-bottom: var(--spacing-lg);
}
.field label {
  display: block;
  color: var(--color-cream);
  font-size: var(--font-size-sm);
  font-weight: bold;
  margin-bottom: var(--spacing-md);
}
.field input,
.field select {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-medium-gray);
  background: var(--color-charcoal);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  transition: border-color 0.2s ease;
}
.field input:focus,
.field select:focus {
  outline: none;
  border-color: var(--color-gold);
}
.submit-btn {
  width: 100%;
  background: var(--color-gold);
  color: var(--color-charcoal);
  font-weight: bold;
  padding: var(--spacing-md);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition:
    opacity 0.3s ease,
    background-color 0.3s ease;
}
.submit-btn:hover {
  opacity: 0.8;
  background: var(--color-light-yellow);
}
</style>
