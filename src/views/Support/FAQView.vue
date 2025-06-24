<!-- src/views/Support/FAQView.vue -->

<template>
  <main class="faq-container">
    <!-- Header Section -->
    <div class="faq-header">
      <h1>Frequently Asked Questions</h1>
      <p class="faq-subtitle">Everything you need to know about Smash Here</p>

      <!-- Search Bar -->
      <div class="faq-search">
        <SearchBar v-model="searchQuery" placeholder="Search FAQ..." />
      </div>
    </div>

    <!-- Quick Links -->
    <div class="faq-categories">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="scrollToCategory(category.id)"
        class="category-btn"
        :class="{ active: activeCategory === category.id }"
      >
        <i :class="category.icon"></i>
        {{ category.name }}
      </button>
    </div>

    <!-- FAQ Content -->
    <div class="faq-content">
      <!-- Getting Started -->
      <section id="getting-started" class="faq-category">
        <h2>
          <i class="pi pi-flag"></i>
          Getting Started
        </h2>

        <div class="faq-item" v-for="faq in filteredFAQ.gettingStarted" :key="faq.id">
          <div class="faq-question" @click="toggleFAQ(faq.id)">
            <h3>{{ faq.question }}</h3>
            <i :class="openFAQs.includes(faq.id) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
          </div>
          <div v-if="openFAQs.includes(faq.id)" class="faq-answer">
            <ul>
              <li v-for="point in faq.answer" :key="point">{{ point }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Roadmaps -->
      <section id="roadmaps" class="faq-category">
        <h2>
          <i class="pi pi-sitemap"></i>
          Roadmaps & Learning Paths
        </h2>

        <div class="faq-item" v-for="faq in filteredFAQ.roadmaps" :key="faq.id">
          <div class="faq-question" @click="toggleFAQ(faq.id)">
            <h3>{{ faq.question }}</h3>
            <i :class="openFAQs.includes(faq.id) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
          </div>
          <div v-if="openFAQs.includes(faq.id)" class="faq-answer">
            <ul>
              <li v-for="point in faq.answer" :key="point">{{ point }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Content Builder -->
      <section id="content-builder" class="faq-category">
        <h2>
          <i class="pi pi-cog"></i>
          Content Builder
        </h2>

        <div class="faq-item" v-for="faq in filteredFAQ.contentBuilder" :key="faq.id">
          <div class="faq-question" @click="toggleFAQ(faq.id)">
            <h3>{{ faq.question }}</h3>
            <i :class="openFAQs.includes(faq.id) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
          </div>
          <div v-if="openFAQs.includes(faq.id)" class="faq-answer">
            <ul>
              <li v-for="point in faq.answer" :key="point">{{ point }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Account & Profile -->
      <section id="account" class="faq-category">
        <h2>
          <i class="pi pi-user"></i>
          Account & Profile
        </h2>

        <div class="faq-item" v-for="faq in filteredFAQ.account" :key="faq.id">
          <div class="faq-question" @click="toggleFAQ(faq.id)">
            <h3>{{ faq.question }}</h3>
            <i :class="openFAQs.includes(faq.id) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
          </div>
          <div v-if="openFAQs.includes(faq.id)" class="faq-answer">
            <ul>
              <li v-for="point in faq.answer" :key="point">{{ point }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Technical Support -->
      <section id="technical" class="faq-category">
        <h2>
          <i class="pi pi-wrench"></i>
          Technical Support
        </h2>

        <div class="faq-item" v-for="faq in filteredFAQ.technical" :key="faq.id">
          <div class="faq-question" @click="toggleFAQ(faq.id)">
            <h3>{{ faq.question }}</h3>
            <i :class="openFAQs.includes(faq.id) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
          </div>
          <div v-if="openFAQs.includes(faq.id)" class="faq-answer">
            <ul>
              <li v-for="point in faq.answer" :key="point">{{ point }}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>

    <!-- Contact Section -->
    <div class="faq-contact">
      <h3>Still have questions?</h3>
      <p>Can't find what you're looking for? Our support team is here to help!</p>
      <div class="contact-buttons">
        <button class="contact-btn primary">
          <i class="pi pi-envelope"></i>
          Contact Support
        </button>
        <button class="contact-btn secondary">
          <a href="https://x.com/SmashHere" target="_blank">
          <i class="pi pi-twitter"></i>
          Join X
          </a>
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SearchBar from '@/components/ui/SearchBar.vue'

// Reactive state
const searchQuery = ref('')
const openFAQs = ref<string[]>([])
const activeCategory = ref('getting-started')

// Categories for navigation
const categories = ref([
  { id: 'getting-started', name: 'Getting Started', icon: 'pi pi-flag' },
  { id: 'roadmaps', name: 'Roadmaps', icon: 'pi pi-sitemap' },
  { id: 'content-builder', name: 'Content Builder', icon: 'pi pi-cog' },
  { id: 'account', name: 'Account', icon: 'pi pi-user' },
  { id: 'technical', name: 'Technical', icon: 'pi pi-wrench' },
])

// FAQ Data
const faqData = ref({
  gettingStarted: [
    {
      id: 'gs-1',
      question: 'What is Smash Here?',
      answer: [
        'Smash Here is an e-sport platform specialized in fighting games',
        'It centralizes and structures learning and progression for players',
        'The platform uses interactive and personalized roadmaps',
        'Designed for beginners, intermediate, and advanced players',
        'Covers various games, characters, and strategies',
      ],
    },
    {
      id: 'gs-2',
      question: 'How do roadmaps work?',
      answer: [
        'Roadmaps are step-by-step guides to achieve specific goals',
        'Each roadmap contains multiple interconnected steps',
        'Steps can have prerequisites (previous steps must be completed)',
        // 'You can track your progress with status indicators: pending, in progress, done, skipped',
        'Visual flowchart shows the learning path clearly',
      ],
    },
    {
      id: 'gs-3',
      question: 'Who can use Smash Here?',
      answer: [
        'Gaming enthusiasts (amateur and professional players)',
        'E-sport coaches looking to create structured content',
        'Players seeking organized learning paths',
        'Communities wanting to share knowledge',
        'Anyone interested in improving their fighting game skills',
      ],
    },
    // {
    //   id: 'gs-4',
    //   question: 'Is Smash Here free to use?',
    //   answer: [
    //     'Basic features are available for free users',
    //     'Premium roadmaps may require subscription',
    //     'Coaches can monetize their content',
    //     'Free users can access public roadmaps',
    //     'Premium features unlock advanced tracking and exclusive content',
    //   ],
    // },
  ],
  roadmaps: [
    {
      id: 'rm-1',
      question: 'How do I follow a roadmap?',
      answer: [
        'Browse available roadmaps by game or skill level',
        'Click on a roadmap to view its structure',
        'Add it to your bookmarks for easy access',
        'Start with the first step (usually marked with a flag icon)',
        // 'Mark steps as completed, in progress, or skipped as you advance',
      ],
    },
    {
      id: 'rm-2',
      question: 'Can I create my own roadmap?',
      answer: [
        'Yes, if you have coach privileges or higher',
        'Use the Content Builder to create structured learning paths',
        'Add steps with titles, descriptions, and learning materials',
        'Connect steps to create a logical progression flow',
        'Publish as public or keep private for specific users',
      ],
    },
    {
      id: 'rm-3',
      question: 'What types of content can be included in steps?',
      answer: [
        'Video tutorials and gameplay footage',
        'Written articles and guides',
        'External links (YouTube, Twitter, Reddit, Discord)',
        'References to other roadmaps',
        // 'Interactive quizzes and exercises',
      ],
    },
    {
      id: 'rm-4',
      question: 'How are roadmaps organized?',
      answer: [
        'Roadmaps are categorized by games (Street Fighter, Tekken, etc.)',
        'Tagged by difficulty level and specific topics',
        'Steps are connected in a directed graph structure',
        'Prerequisites ensure logical learning progression',
        'Visual flowchart displays the complete learning path',
      ],
    },
  ],
  contentBuilder: [
    {
      id: 'cb-1',
      question: 'How does the Content Builder work?',
      answer: [
        'Access the builder from your profile dashboard',
        'Create individual steps with titles and descriptions',
        'Add multimedia content (videos, articles, links)',
        'Use the visual editor to connect steps in sequence',
        'Drag and drop to rearrange step positions',
      ],
    },
    {
      id: 'cb-2',
      question: 'How do I connect steps in the visual editor?',
      answer: [
        'Steps appear as nodes in the flowchart interface',
        'Drag from the bottom handle of a source step',
        'Connect to the top handle of the target step',
        'Arrows show the learning progression direction',
        'Delete connections by selecting edges and pressing Delete',
      ],
    },
    {
      id: 'cb-3',
      question: 'Can I reuse steps across multiple roadmaps?',
      answer: [
        'Yes, steps can belong to multiple roadmaps',
        'Create reusable content that appears in different contexts',
        'Maintain consistency across related learning paths',
        'Updates to a step reflect in all associated roadmaps',
        'Manage step relationships through the step editor',
      ],
    },
    {
      id: 'cb-4',
      question: 'What are the requirements for publishing a roadmap?',
      answer: [
        'Must have at least one complete step',
        'All steps should have meaningful titles and descriptions',
        'Content should be appropriate and valuable',
        'Set proper tags and game associations',
        // 'Choose between public or premium visibility',
      ],
    },
  ],
  account: [
    {
      id: 'acc-1',
      question: 'How do I create an account?',
      answer: [
        'Click the "Register" button on the homepage',
        'Provide username, email, and secure password',
        // 'Alternatively, sign up using Twitter/X integration',
        // 'Verify your email address if required',
        // 'Complete your profile with optional information',
      ],
    },
    // {
    //   id: 'acc-2',
    //   question: 'What are the different user types?',
    //   answer: [
    //     'User: Basic account with access to public roadmaps',
    //     'Coach: Can create and publish roadmaps',
    //     'Super Admin: Platform administration privileges',
    //     'Each type has different permissions and capabilities',
    //     'Contact support to upgrade your account type',
    //   ],
    // },
    // {
    //   id: 'acc-2',
    //   question: 'How do I track my progress?',
    //   answer: [
    //     'Progress is automatically saved as you complete steps',
    //     'View your dashboard to see all followed roadmaps',
    //     'Status indicators show: pending, in progress, done, skipped',
    //     'Progress percentages display overall completion',
    //     'Export your learning history if needed',
    //   ],
    // },
    {
      id: 'acc-2',
      question: 'Can I delete my account and data?',
      answer: [
        'Yes, account deletion is available in profile settings',
        'This permanently removes all personal data',
        'Your created content may be anonymized or transferred',
        'Progress and comments will be dissociated from your profile',
        'This action cannot be undone - proceed with caution',
      ],
    },
  ],
  technical: [
    {
      id: 'tech-1',
      question: 'Which platforms are supported?',
      answer: [
        'Web application works on all modern browsers',
        'Responsive design supports desktop, tablet, and mobile',
        'iOS and Android compatibility through web browsers',
        'No native mobile app required',
        'Optimized for Chrome, Firefox, Safari, and Edge',
      ],
    },
    // {
    //   id: 'tech-2',
    //   question: 'Why is my progress not saving?',
    //   answer: [
    //     'Check your internet connection stability',
    //     'Ensure you are logged into your account',
    //     'Clear browser cache and cookies',
    //     'Disable browser extensions that might interfere',
    //     'Contact support if the issue persists',
    //   ],
    // },
    {
      id: 'tech-2',
      question: 'How is my data protected?',
      answer: [
        'All data is encrypted using AES-256 encryption',
        'Passwords are securely hashed with bcrypt',
        'HTTPS encryption protects all communications',
        'GDPR compliant data handling practices',
        'Regular security audits and updates',
      ],
    },
    {
      id: 'tech-3',
      question: 'What should I do if I encounter a bug?',
      answer: [
        'Try refreshing the page or clearing browser cache',
        'Check if the issue occurs in an incognito/private window',
        'Take a screenshot of any error messages',
        'Report the bug through our support contact',
        'Include browser version and steps to reproduce the issue',
      ],
    },
  ],
})

// Computed property for filtered FAQ based on search
const filteredFAQ = computed(() => {
  if (!searchQuery.value) return faqData.value

  const query = searchQuery.value.toLowerCase()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filtered: any = {}

  Object.keys(faqData.value).forEach((category) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filtered[category] = (faqData.value as any)[category].filter(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (faq: any) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.some((answer: string) => answer.toLowerCase().includes(query)),
    )
  })

  return filtered
})

// Methods
function toggleFAQ(faqId: string) {
  const index = openFAQs.value.indexOf(faqId)
  if (index > -1) {
    openFAQs.value.splice(index, 1)
  } else {
    openFAQs.value.push(faqId)
  }
}

function scrollToCategory(categoryId: string) {
  const element = document.getElementById(categoryId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeCategory.value = categoryId
  }
}

// Scroll spy to update active category
function updateActiveCategory() {
  const sections = categories.value.map((cat) => cat.id)
  let current = 'getting-started'

  for (const section of sections) {
    const element = document.getElementById(section)
    if (element) {
      const rect = element.getBoundingClientRect()
      if (rect.top <= 100) {
        current = section
      }
    }
  }

  activeCategory.value = current
}

onMounted(() => {
  window.addEventListener('scroll', updateActiveCategory)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveCategory)
})
</script>

<style scoped>
.faq-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  min-height: 100vh;
}

/* Header */
.faq-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.faq-header h1 {
  font-family: var(--font-primary);
  font-size: var(--font-size-4xl);
  color: var(--color-gold);
  margin-bottom: var(--spacing-md);
}

.faq-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-light-gray);
  margin-bottom: var(--spacing-xl);
}

.faq-search {
  max-width: 500px;
  margin: 0 auto;
}

/* Categories Navigation */
.faq-categories {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-3xl);
  padding: var(--spacing-lg);
  background: var(--color-darker-charcoal);
  border-radius: var(--radius-lg);
}

.category-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-dark-gray);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn:hover {
  border-color: var(--color-gold);
  background: var(--color-charcoal);
}

.category-btn.active {
  background: var(--color-gold);
  color: var(--color-charcoal);
  border-color: var(--color-gold);
}

.category-btn i {
  font-size: var(--font-size-base);
}

/* FAQ Content */
.faq-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3xl);
}

.faq-category h2 {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  color: var(--color-gold);
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--color-medium-gray);
}

.faq-category h2 i {
  font-size: var(--font-size-xl);
}

/* FAQ Items */
.faq-item {
  background: var(--color-darker-charcoal);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: var(--color-gold);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: background 0.3s ease;
}

.faq-question:hover {
  background: var(--color-charcoal);
}

.faq-question h3 {
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.faq-question i {
  color: var(--color-gold);
  font-size: var(--font-size-base);
  transition: transform 0.3s ease;
}

.faq-answer {
  padding: 0 var(--spacing-lg) var(--spacing-lg);
  border-top: 1px solid var(--color-medium-gray);
  background: var(--color-charcoal);
}

.faq-answer ul {
  list-style: none;
  padding: 0;
  margin: var(--spacing-md) 0 0;
}

.faq-answer li {
  color: var(--color-light-gray);
  font-size: var(--font-size-base);
  line-height: 1.6;
  margin-bottom: var(--spacing-sm);
  position: relative;
  padding-left: var(--spacing-lg);
}

.faq-answer li::before {
  content: '•';
  color: var(--color-gold);
  font-weight: bold;
  position: absolute;
  left: 0;
}

/* Contact Section */
.faq-contact {
  text-align: center;
  background: var(--color-darker-charcoal);
  padding: var(--spacing-3xl);
  border-radius: var(--radius-lg);
  margin-top: var(--spacing-4xl);
}

.faq-contact h3 {
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  color: var(--color-gold);
  margin-bottom: var(--spacing-md);
}

.faq-contact p {
  color: var(--color-light-gray);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xl);
}

.contact-buttons {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.contact-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contact-btn.primary {
  background: var(--color-gold);
  color: var(--color-charcoal);
}

.contact-btn.primary:hover {
  background: #ffed4e;
  transform: translateY(-2px);
}

.contact-btn.secondary {
  background: var(--color-dark-gray);
  color: var(--color-cream);
  border: 2px solid var(--color-medium-gray);
}

.contact-btn.secondary:hover {
  border-color: var(--color-gold);
  background: var(--color-charcoal);
}

/* Responsive Design */
@media (max-width: 768px) {
  .faq-container {
    padding: var(--spacing-lg);
  }

  .faq-header h1 {
    font-size: var(--font-size-3xl);
  }

  .faq-categories {
    flex-direction: column;
    align-items: center;
  }

  .category-btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }

  .faq-question {
    padding: var(--spacing-md);
  }

  .faq-question h3 {
    font-size: var(--font-size-base);
  }

  .contact-buttons {
    flex-direction: column;
    align-items: center;
  }

  .contact-btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .faq-header h1 {
    font-size: var(--font-size-2xl);
  }

  .faq-subtitle {
    font-size: var(--font-size-base);
  }

  .faq-category h2 {
    font-size: var(--font-size-xl);
  }

  .faq-contact {
    padding: var(--spacing-xl);
  }
}
</style>
