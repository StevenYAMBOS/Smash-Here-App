<!-- src/components/ui/RoadmapsSlider.vue -->

<template>
  <Carousel :itemsToShow="3" wrapAround :autoplayTimeout="3000">
    <Slide v-for="rm in state.roadmaps" :key="rm.id">
      <RoadmapCardForSlider :roadmap="rm" :author="state.authors.get(rm.CreatedBy)" />
    </Slide>
  </Carousel>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import RoadmapCardForSlider from './RoadmapCardForSlider.vue'
import type { Roadmap, User } from '@/types/collections'

const state = reactive({
  roadmaps: [] as Roadmap[],
  authors: new Map<string, User>(),
  loading: true,
  error: '',
})

onMounted(async () => {
  try {
    // Récupérer les roadmaps
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmaps`,
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    state.roadmaps = await res.json()

    // Récupérer les auteurs uniques
    const authorIds = [...new Set(state.roadmaps.map(rm => rm.CreatedBy))]
    
    // Faire les appels API pour chaque auteur
    const authorPromises = authorIds.map(async (authorId) => {
      try {
        const userRes = await fetch(
          `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/user/${authorId}`
        )
        if (userRes.ok) {
          const user = await userRes.json()
          state.authors.set(authorId, user)
        }
      } catch (err) {
        console.error(`Erreur lors du chargement de l'utilisateur ${authorId}:`, err)
        // En cas d'erreur, on peut créer un utilisateur par défaut
        state.authors.set(authorId, { 
          id: authorId, 
          username: 'Unknown User',
          email: '',
          password: '',
          type: 'user',
          profilePicture: '',
          createdAt: '',
          updatedAt: '',
          lastLogin: '',
          Bookmarks: [],
          RoadmapsStarted: [],
          RoadmapsCreated: [],
          StepsCreated: [],
          ContentsCreated: [],
          Comments: []
        })
      }
    })

    // Attendre que tous les auteurs soient chargés
    await Promise.all(authorPromises)

  } catch (err) {
    state.error = 'Erreur lors du chargement des roadmaps'
    console.error('Error loading roadmaps:', err)
  } finally {
    state.loading = false
  }
})
</script>

<style scoped>
.carousel {
  width: 100%;
  margin: 0 auto;
}
</style>
