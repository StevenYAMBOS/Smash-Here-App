<!-- src/components/ui/CreateStepForm.vue -->

<template>
  <form @submit.prevent="submitStep" class="create-step-form">
    <h2>Create a new Setp</h2>

    <div class="field">
      <label for="title">Title</label>
      <input id="title" v-model="title" type="text" placeholder="Enter step title" required />
    </div>

    <div class="field">
      <label for="subTitle">Subtitle</label>
      <input
        id="subTitle"
        v-model="subTitle"
        type="text"
        placeholder="Enter step subtitle"
        required
      />
    </div>

    <div class="field">
      <label for="description">Description</label>
      <input
        id="description"
        v-model="description"
        type="text"
        placeholder="Enter step description"
        required
      />
    </div>

    <SubmitButton
      type="submit"
      :label="loading ? 'Saving…' : 'Save'"
      :disabled="loading"
      icon="pi pi-save"
      iconPosition="left"
      variant="primary"
    />
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { defineEmits } from 'vue'
import { useToast } from 'vue-toast-notification'
import SubmitButton from '@/components/ui/SubmitButton.vue'
import { useUserStore } from '@/stores/user'

const toast = useToast()
const loading = ref(false)
const userStore = useUserStore()

const title = ref('')
const subTitle = ref('')
const description = ref('')

async function submitStep() {
  if (loading.value) return
  loading.value = true

  const payload = {
    title: title.value,
    subTitle: subTitle.value,
    description: description.value,
  }

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/step`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.token}`,
        },
        body: JSON.stringify(payload),
      },
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    await res.json()
    toast.success('Step created successfully!', { position: 'top-right' })

    // Réinitialisation du formulaire
    title.value = ''
    subTitle.value = ''
    description.value = ''
    await userStore.fetchProfile()
    emit('navigate', 'list-steps')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err)
    toast.error('Failed to create step', { position: 'top-right' })
  } finally {
    loading.value = false
  }
}

const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()
</script>

<style scoped>
.create-step-form {
  width: 100%;
  background: var(--color-darker-charcoal);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-md);
  max-width: 500px;
  margin: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}
.create-step-form h2 {
  color: var(--color-cream);
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-lg);
  font-weight: bold;
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
