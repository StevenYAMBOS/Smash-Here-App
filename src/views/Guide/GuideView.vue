<template>
  <div class="guide-view">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <p class="loading-text">Loading guide...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-content">
        <i class="pi pi-exclamation-triangle error-icon"></i>
        <h2 class="error-title">Guide Not Found</h2>
        <p class="error-message">{{ error }}</p>
        <button @click="router.push('/')" class="error-button">
          <i class="pi pi-home"></i>
          Return Home
        </button>
      </div>
    </div>

    <!-- Guide Content -->
    <div v-else-if="guide" class="guide-container">
      <!-- Header -->
      <HeaderGuide
        :guide="guide"
        :author-name="authorName"
        @like="handleLike"
        @bookmark="handleBookmark"
        @share="handleShare"
      />

      <!-- Main Content -->
      <main class="guide-content">
        <div class="content-wrapper">
          <!-- Navigation breadcrumb -->
          <nav class="breadcrumb">
            <router-link to="/" class="breadcrumb-link">
              <i class="pi pi-home"></i>
              Home
            </router-link>
            <i class="pi pi-angle-right breadcrumb-separator"></i>
            <router-link to="/dashboard" class="breadcrumb-link">Content Builder</router-link>
            <i class="pi pi-angle-right breadcrumb-separator"></i>
            <span class="breadcrumb-current">{{ guide.title }}</span>
          </nav>

          <!-- Article Content -->
          <article class="guide-article">
            <!-- Table of Contents (si nécessaire) -->
            <aside v-if="tableOfContents.length > 0" class="table-of-contents">
              <h3 class="toc-title">Table of Contents</h3>
              <ul class="toc-list">
                <li v-for="item in tableOfContents" :key="item.id" class="toc-item">
                  <a :href="`#${item.id}`" class="toc-link" :class="`toc-level-${item.level}`">
                    {{ item.text }}
                  </a>
                </li>
              </ul>
            </aside>

            <!-- Guide Content -->
            <div class="guide-text-content" v-html="formattedContent"></div>

            <!-- Tags (si disponibles) -->
            <div v-if="guide.Tags && guide.Tags.length > 0" class="guide-tags">
              <h4 class="tags-title">Tags</h4>
              <div class="tags-list">
                <span v-for="tag in guide.Tags" :key="tag" class="tag-item">
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Footer du guide -->
            <footer class="guide-footer">
              <div class="footer-info">
                <p class="last-updated">Last updated: {{ formatDate(guide.updatedAt) }}</p>
                <p v-if="guide.version" class="version-info">Version: {{ guide.version }}</p>
              </div>

              <div class="footer-actions">
                <button @click="handleLike" class="footer-btn" :class="{ liked: isLiked }">
                  <i class="pi pi-heart"></i>
                  <span>{{ guide.likesCount || 0 }}</span>
                </button>

                <button
                  @click="handleBookmark"
                  class="footer-btn"
                  :class="{ bookmarked: isBookmarked }"
                >
                  <i class="pi pi-bookmark"></i>
                  Bookmark
                </button>

                <button @click="handleShare" class="footer-btn">
                  <i class="pi pi-share-alt"></i>
                  Share
                </button>
              </div>
            </footer>
          </article>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { useUserStore } from '@/stores/user'
import HeaderGuide from '@/components/layout/HeaderGuide.vue'
import type { Guide } from '@/types/collections'

// Composables
const route = useRoute()
const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

// États réactifs
const loading = ref(true)
const error = ref<string | null>(null)
const guide = ref<Guide | null>(null)
const isLiked = ref(false)
const isBookmarked = ref(false)
const tableOfContents = ref<Array<{ id: string; text: string; level: number }>>([])

// Computed
const authorName = computed(() => {
  // Récupérer le nom de l'auteur depuis le store ou les données du guide
  return 'Guide Author' // À adapter selon votre structure
})

const formattedContent = computed(() => {
  if (!guide.value?.content) return ''

  // Traiter le contenu HTML
  let content = guide.value.content

  // Ajouter des IDs aux headers pour la table des matières
  content = content.replace(/<h([1-6])>(.*?)<\/h[1-6]>/g, (match, level, text) => {
    const id = text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
    return `<h${level} id="${id}">${text}</h${level}>`
  })

  return content
})

// Méthodes
const fetchGuide = async (guideId: string) => {
  try {
    loading.value = true
    error.value = null

    // Utiliser le store pour récupérer le guide
    await userStore.fetchUserGuides()

    // Chercher le guide dans les guides de l'utilisateur
    const foundGuide = userStore.guidesCreated.find((g) => g.id === guideId)

    if (!foundGuide) {
      throw new Error('Guide not found')
    }

    guide.value = foundGuide
    console.log('Guide loaded:', guide.value)

    // Générer la table des matières
    await nextTick()
    generateTableOfContents()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
    console.error('Error fetching guide:', err)
  } finally {
    loading.value = false
  }
}

const generateTableOfContents = () => {
  const content = document.querySelector('.guide-text-content')
  if (!content) return

  const headers = content.querySelectorAll('h1, h2, h3, h4, h5, h6')
  tableOfContents.value = Array.from(headers).map((header) => ({
    id: header.id || '',
    text: header.textContent || '',
    level: parseInt(header.tagName.charAt(1)),
  }))
}

const handleLike = async () => {
  try {
    // Pour l'instant, juste un toggle local
    isLiked.value = !isLiked.value
    if (guide.value) {
      guide.value.likesCount = (guide.value.likesCount || 0) + (isLiked.value ? 1 : -1)
    }
    toast.success(isLiked.value ? 'Guide liked!' : 'Like removed')
  } catch (err) {
    toast.error('Failed to like guide')
    console.error('Error liking guide:', err)
  }
}

const handleBookmark = async () => {
  try {
    // Pour l'instant, juste un toggle local
    isBookmarked.value = !isBookmarked.value
    toast.success(isBookmarked.value ? 'Guide bookmarked!' : 'Bookmark removed')
  } catch (err) {
    toast.error('Failed to bookmark guide')
    console.error('Error bookmarking guide:', err)
  }
}

const handleShare = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: guide.value?.title,
        text: guide.value?.description,
        url: window.location.href,
      })
    } else {
      // Fallback: copier l'URL
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  } catch (err) {
    console.error('Error sharing:', err)
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Lifecycle
onMounted(() => {
  const guideId = route.params.id as string
  if (guideId) {
    fetchGuide(guideId)
  } else {
    error.value = 'Invalid guide ID'
    loading.value = false
  }
})
</script>

<style scoped>
.guide-view {
  min-height: 100vh;
  background: var(--color-black);
}

/* Loading & Error States */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-xl);
  text-align: center;
}

.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: var(--spacing-lg);
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  border-top: 2px solid var(--color-gold);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(2) {
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  border-top-color: var(--color-orange);
  animation-duration: 0.8s;
  animation-direction: reverse;
}

.spinner-ring:nth-child(3) {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  border-top-color: var(--color-light-yellow);
  animation-duration: 0.6s;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-lg);
}

.error-content {
  max-width: 400px;
}

.error-icon {
  font-size: var(--font-size-5xl);
  color: var(--color-gold);
  margin-bottom: var(--spacing-lg);
}

.error-title {
  color: var(--color-cream);
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-md);
}

.error-message {
  color: var(--color-light-gray);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-lg);
}

.error-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: linear-gradient(135deg, var(--color-gold), var(--color-orange));
  color: var(--color-charcoal);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.error-button:hover {
  background: linear-gradient(135deg, var(--color-light-yellow), var(--color-gold));
  transform: translateY(-2px);
}

/* Main Content */
.guide-content {
  background: linear-gradient(to bottom, var(--color-darker-charcoal), var(--color-charcoal));
  min-height: 100vh;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-md);
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-gold);
  text-decoration: none;
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: var(--color-light-yellow);
}

.breadcrumb-separator {
  color: var(--color-medium-gray);
  font-size: var(--font-size-xs);
}

.breadcrumb-current {
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

/* Article */
.guide-article {
  position: relative;
}

/* Table of Contents */
.table-of-contents {
  position: sticky;
  top: var(--spacing-xl);
  float: right;
  width: 250px;
  margin-left: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  background: var(--color-darker-charcoal);
  border: 1px solid var(--color-gold);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}

.toc-title {
  color: var(--color-gold);
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  font-weight: bold;
  margin: 0 0 var(--spacing-md) 0;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin-bottom: var(--spacing-xs);
}

.toc-link {
  display: block;
  color: var(--color-light-gray);
  text-decoration: none;
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  padding: var(--spacing-xs) 0;
  transition: color 0.3s ease;
}

.toc-link:hover {
  color: var(--color-gold);
}

.toc-level-1 {
  font-weight: 600;
}
.toc-level-2 {
  padding-left: var(--spacing-md);
}
.toc-level-3 {
  padding-left: var(--spacing-lg);
}
.toc-level-4 {
  padding-left: var(--spacing-xl);
}

/* Guide Content */
.guide-text-content {
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-lg);
  line-height: 1.8;
  margin-bottom: var(--spacing-2xl);
}

/* Styles pour le contenu HTML */
.guide-text-content :deep(h1),
.guide-text-content :deep(h2),
.guide-text-content :deep(h3),
.guide-text-content :deep(h4),
.guide-text-content :deep(h5),
.guide-text-content :deep(h6) {
  color: var(--color-gold);
  font-family: var(--font-primary);
  font-weight: bold;
  margin: var(--spacing-xl) 0 var(--spacing-lg) 0;
  line-height: 1.3;
}

.guide-text-content :deep(h1) {
  font-size: var(--font-size-3xl);
}
.guide-text-content :deep(h2) {
  font-size: var(--font-size-2xl);
}
.guide-text-content :deep(h3) {
  font-size: var(--font-size-xl);
}
.guide-text-content :deep(h4) {
  font-size: var(--font-size-lg);
}

.guide-text-content :deep(p) {
  margin-bottom: var(--spacing-lg);
  text-align: justify;
}

.guide-text-content :deep(strong) {
  color: var(--color-gold);
  font-weight: bold;
}

.guide-text-content :deep(em) {
  color: var(--color-light-yellow);
  font-style: italic;
}

.guide-text-content :deep(a) {
  color: var(--color-gold);
  text-decoration: none;
  border-bottom: 1px solid var(--color-gold);
  transition: all 0.3s ease;
}

.guide-text-content :deep(a:hover) {
  color: var(--color-light-yellow);
  border-bottom-color: var(--color-light-yellow);
}

.guide-text-content :deep(ul),
.guide-text-content :deep(ol) {
  margin: var(--spacing-lg) 0;
  padding-left: var(--spacing-xl);
}

.guide-text-content :deep(li) {
  margin-bottom: var(--spacing-sm);
}

.guide-text-content :deep(blockquote) {
  background: rgba(255, 215, 0, 0.1);
  border-left: 4px solid var(--color-gold);
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-lg);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  font-style: italic;
}

.guide-text-content :deep(code) {
  background: var(--color-charcoal);
  color: var(--color-light-yellow);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: var(--font-size-sm);
}

.guide-text-content :deep(pre) {
  background: var(--color-charcoal);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
  overflow-x: auto;
}

.guide-text-content :deep(pre code) {
  background: none;
  padding: 0;
}

.guide-text-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  margin: var(--spacing-lg) 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.guide-text-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: var(--spacing-lg) 0;
  background: var(--color-darker-charcoal);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.guide-text-content :deep(th),
.guide-text-content :deep(td) {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--color-medium-gray);
}

.guide-text-content :deep(th) {
  background: var(--color-gold);
  color: var(--color-charcoal);
  font-weight: bold;
}

/* Tags */
.guide-tags {
  margin: var(--spacing-2xl) 0;
  padding: var(--spacing-lg) 0;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
}

.tags-title {
  color: var(--color-gold);
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  font-weight: bold;
  margin-bottom: var(--spacing-md);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.tag-item {
  background: rgba(255, 215, 0, 0.1);
  color: var(--color-gold);
  border: 1px solid var(--color-gold);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

/* Footer */
.guide-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xl) 0;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  margin-top: var(--spacing-2xl);
}

.footer-info {
  color: var(--color-medium-gray);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
}

.footer-actions {
  display: flex;
  gap: var(--spacing-md);
}

.footer-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  color: var(--color-medium-gray);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.footer-btn:hover {
  color: var(--color-gold);
  border-color: var(--color-gold);
}

.footer-btn.liked,
.footer-btn.bookmarked {
  color: var(--color-gold);
  border-color: var(--color-gold);
  background: rgba(255, 215, 0, 0.1);
}

/* Responsive */
@media (max-width: 1024px) {
  .table-of-contents {
    display: none;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: var(--spacing-xl) var(--spacing-sm);
  }

  .guide-text-content {
    font-size: var(--font-size-base);
  }

  .guide-footer {
    flex-direction: column;
    gap: var(--spacing-lg);
    text-align: center;
  }

  .footer-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .breadcrumb {
    flex-wrap: wrap;
  }

  .footer-actions {
    flex-direction: column;
    width: 100%;
  }

  .footer-btn {
    justify-content: center;
    width: 100%;
  }
}
</style>
