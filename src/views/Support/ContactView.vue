<!-- src/views/Support/ContactView.vue -->

<template>
  <main class="contact-view">
    <!-- Hero Section -->
    <section class="contact-hero">
      <div class="hero-content">
        <h1>
          <i class="pi pi-headphones"></i>
          Get in Touch
        </h1>
        <p class="hero-subtitle">
          Need help with Smash Here? Our support team is ready to assist you with any questions or
          issues.
        </p>

        <!-- Quick Stats -->
        <div class="support-stats">
          <div class="stat-item">
            <i class="pi pi-clock"></i>
            <span class="stat-value">&lt; 24h</span>
            <span class="stat-label">Response Time</span>
          </div>
          <div class="stat-item">
            <i class="pi pi-users"></i>
            <span class="stat-value">98%</span>
            <span class="stat-label">Satisfaction Rate</span>
          </div>
          <div class="stat-item">
            <i class="pi pi-globe"></i>
            <span class="stat-value">24/7</span>
            <span class="stat-label">Available</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="contact-content">
      <div class="content-grid">
        <!-- Contact Form -->
        <div class="form-section">
          <ContactForm />
        </div>

        <!-- Support Information -->
        <aside class="support-info">
          <!-- Alternative Contact Methods -->
          <div class="info-card">
            <h3>
              <i class="pi pi-globe"></i>
              Other ways to reach us
            </h3>

            <div class="contact-methods">
              <a href="https://x.com/SmashHere" target="_blank" class="contact-method twitter">
                <i class="pi pi-twitter"></i>
                <div class="method-info">
                  <h4>X Community</h4>
                  <p>Join our active community for real-time support</p>
                  <span class="method-status online">Online now</span>
                </div>
              </a>

              <a href="mailto:smashhere@contact.com" class="contact-method email">
                <i class="pi pi-envelope"></i>
                <div class="method-info">
                  <h4>Direct email</h4>
                  <p>smashhere@contact.com</p>
                  <span class="method-status">24h response</span>
                </div>
              </a>

              <a href="/faq" class="contact-method faq">
                <i class="pi pi-question-circle"></i>
                <div class="method-info">
                  <h4>FAQ</h4>
                  <p>Find instant answers to common questions</p>
                  <span class="method-status">Instant</span>
                </div>
              </a>
            </div>
          </div>

          <!-- Status & Updates
          <div class="info-card">
            <h3>
              <i class="pi pi-info-circle"></i>
              Service Status
            </h3>

            <div class="service-status">
              <div class="status-item">
                <div class="status-indicator operational"></div>
                <span>Platform Services</span>
                <span class="status-label operational">Operational</span>
              </div>
              <div class="status-item">
                <div class="status-indicator operational"></div>
                <span>Content Delivery</span>
                <span class="status-label operational">Operational</span>
              </div>
              <div class="status-item">
                <div class="status-indicator operational"></div>
                <span>User Authentication</span>
                <span class="status-label operational">Operational</span>
              </div>
            </div>

            <a href="#" class="status-link">
              <i class="pi pi-external-link"></i>
              View Status Page
            </a>
          </div> -->

          <!-- Support Hours -->
          <div class="info-card">
            <h3>
              <i class="pi pi-calendar"></i>
              Support Hours
            </h3>

            <div class="support-hours">
              <div class="hours-item">
                <span class="day">Monday - Friday</span>
                <span class="time">9:00 AM - 6:00 PM (EST)</span>
              </div>
              <div class="hours-item">
                <span class="day">Saturday</span>
                <span class="time">10:00 AM - 4:00 PM (EST)</span>
              </div>
              <div class="hours-item">
                <span class="day">Sunday</span>
                <span class="time">Emergency support only</span>
              </div>
            </div>

            <div class="current-status">
              <div class="status-indicator" :class="supportStatus.class"></div>
              <span>{{ supportStatus.text }}</span>
            </div>
          </div>

          <!-- Common Issues -->
          <div class="info-card">
            <h3>
              <i class="pi pi-list"></i>
              Common Issues
            </h3>

            <div class="common-issues">
              <a href="/faq#account" class="issue-link">
                <i class="pi pi-user"></i>
                <span>Account & Login Problems</span>
                <i class="pi pi-angle-right"></i>
              </a>
              <a href="/faq#roadmaps" class="issue-link">
                <i class="pi pi-sitemap"></i>
                <span>Roadmap Progress Issues</span>
                <i class="pi pi-angle-right"></i>
              </a>
              <a href="/faq#technical" class="issue-link">
                <i class="pi pi-cog"></i>
                <span>Technical Difficulties</span>
                <i class="pi pi-angle-right"></i>
              </a>
              <a href="/faq#content-builder" class="issue-link">
                <i class="pi pi-wrench"></i>
                <span>Content Builder Help</span>
                <i class="pi pi-angle-right"></i>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <!-- Additional Resources
    <section class="additional-resources">
      <div class="resources-container">
        <h2>Additional Resources</h2>

        <div class="resources-grid">
          <div class="resource-card">
            <i class="pi pi-book"></i>
            <h3>Documentation</h3>
            <p>Comprehensive guides and tutorials for all features</p>
            <a href="/docs" class="resource-link">
              Browse Docs
              <i class="pi pi-arrow-right"></i>
            </a>
          </div>

          <div class="resource-card">
            <i class="pi pi-video"></i>
            <h3>Video Tutorials</h3>
            <p>Step-by-step video guides for getting started</p>
            <a href="/tutorials" class="resource-link">
              Watch Videos
              <i class="pi pi-arrow-right"></i>
            </a>
          </div>

          <div class="resource-card">
            <i class="pi pi-comments"></i>
            <h3>Community Forum</h3>
            <p>Connect with other users and share knowledge</p>
            <a href="/community" class="resource-link">
              Join Discussion
              <i class="pi pi-arrow-right"></i>
            </a>
          </div>

          <div class="resource-card">
            <i class="pi pi-github"></i>
            <h3>Developer Resources</h3>
            <p>API documentation and developer tools</p>
            <a href="/developers" class="resource-link">
              Developer Hub
              <i class="pi pi-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
    -->
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ContactForm from '@/components/ui/ContactForm.vue'

// Support status logic
const currentTime = ref(new Date())

const supportStatus = computed(() => {
  const now = currentTime.value
  const day = now.getDay() // 0 = Sunday, 1 = Monday, etc.
  const hour = now.getHours()

  // Monday to Friday: 9 AM to 6 PM EST
  if (day >= 1 && day <= 5 && hour >= 9 && hour <= 18) {
    return {
      class: 'online',
      text: 'Support team is online',
    }
  }
  // Saturday: 10 AM to 4 PM EST
  else if (day === 6 && hour >= 10 && hour <= 16) {
    return {
      class: 'online',
      text: 'Support team is online',
    }
  }
  // Sunday or outside hours
  else {
    return {
      class: 'offline',
      text: 'Support team is offline',
    }
  }
})

// Update time every minute
onMounted(() => {
  const interval = setInterval(() => {
    currentTime.value = new Date()
  }, 60000) // Update every minute

  // Cleanup on unmount
  return () => clearInterval(interval)
})
</script>

<style scoped>
.contact-view {
  min-height: 100vh;
  background: var(--color-darker-charcoal);
}

/* Hero Section */
.contact-hero {
  background: linear-gradient(135deg, var(--color-charcoal), var(--color-darker-charcoal));
  padding: var(--spacing-4xl) var(--spacing-xl);
  text-align: center;
  border-bottom: 1px solid var(--color-medium-gray);
}

.hero-content h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  font-family: var(--font-primary);
  font-size: var(--font-size-4xl);
  color: var(--color-gold);
  margin-bottom: var(--spacing-lg);
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-light-gray);
  max-width: 600px;
  margin: 0 auto var(--spacing-3xl);
  line-height: 1.6;
}

/* Support Stats */
.support-stats {
  display: flex;
  justify-content: center;
  gap: var(--spacing-3xl);
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  background: var(--color-dark-gray);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-medium-gray);
  min-width: 120px;
}

.stat-item i {
  font-size: var(--font-size-2xl);
  color: var(--color-gold);
}

.stat-value {
  font-family: var(--font-primary);
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--color-cream);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-light-gray);
}

/* Main Content */
.contact-content {
  padding: var(--spacing-3xl) var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-3xl);
  align-items: start;
}

/* Support Info Cards */
.support-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.info-card {
  background: var(--color-charcoal);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
}

.info-card h3 {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  color: var(--color-gold);
  margin-bottom: var(--spacing-lg);
}

/* Contact Methods */
.contact-methods {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.contact-method {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--color-dark-gray);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.contact-method:hover {
  border-color: var(--color-gold);
  background: var(--color-darker-charcoal);
}

.contact-method i {
  font-size: var(--font-size-xl);
  color: var(--color-gold);
  min-width: 24px;
}

.method-info h4 {
  color: var(--color-cream);
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-xs);
}

.method-info p {
  color: var(--color-light-gray);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-xs);
}

.method-status {
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  background: var(--color-medium-gray);
  color: var(--color-cream);
}

.method-status.online {
  background: #4caf50;
  color: white;
}

/* Service Status */
.service-status {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.status-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) 0;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-medium-gray);
}

.status-indicator.operational {
  background: #4caf50;
}

.status-indicator.degraded {
  background: var(--color-orange);
}

.status-indicator.outage {
  background: #f44336;
}

.status-label {
  margin-left: auto;
  font-size: var(--font-size-sm);
  color: var(--color-light-gray);
}

.status-label.operational {
  color: #4caf50;
}

.status-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-gold);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color 0.3s ease;
}

.status-link:hover {
  color: #ffed4e;
}

/* Support Hours */
.support-hours {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.hours-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-medium-gray);
}

.hours-item:last-child {
  border-bottom: none;
}

.day {
  color: var(--color-cream);
  font-weight: 500;
}

.time {
  color: var(--color-light-gray);
  font-size: var(--font-size-sm);
}

.current-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--color-dark-gray);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-cream);
}

.current-status .status-indicator.online {
  background: #4caf50;
}

.current-status .status-indicator.offline {
  background: var(--color-medium-gray);
}

/* Common Issues */
.common-issues {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.issue-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-dark-gray);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-cream);
  transition: all 0.3s ease;
}

.issue-link:hover {
  border-color: var(--color-gold);
  background: var(--color-darker-charcoal);
}

.issue-link i:first-child {
  color: var(--color-gold);
  min-width: 20px;
}

.issue-link i:last-child {
  margin-left: auto;
  color: var(--color-medium-gray);
}

/* Additional Resources */
.additional-resources {
  background: var(--color-charcoal);
  padding: var(--spacing-4xl) var(--spacing-xl);
  border-top: 1px solid var(--color-medium-gray);
}

.resources-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.resources-container h2 {
  font-family: var(--font-primary);
  font-size: var(--font-size-3xl);
  color: var(--color-gold);
  margin-bottom: var(--spacing-3xl);
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
}

.resource-card {
  background: var(--color-dark-gray);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  transition: all 0.3s ease;
}

.resource-card:hover {
  border-color: var(--color-gold);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(255, 215, 0, 0.1);
}

.resource-card i {
  font-size: var(--font-size-4xl);
  color: var(--color-gold);
  margin-bottom: var(--spacing-lg);
}

.resource-card h3 {
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  color: var(--color-cream);
  margin-bottom: var(--spacing-md);
}

.resource-card p {
  color: var(--color-light-gray);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-lg);
  line-height: 1.5;
}

.resource-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-gold);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.resource-link:hover {
  color: #ffed4e;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }

  .support-info {
    order: -1;
  }
}

@media (max-width: 768px) {
  .contact-hero {
    padding: var(--spacing-3xl) var(--spacing-lg);
  }

  .hero-content h1 {
    font-size: var(--font-size-3xl);
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .support-stats {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .stat-item {
    flex-direction: row;
    min-width: 200px;
    text-align: left;
  }

  .contact-content {
    padding: var(--spacing-xl) var(--spacing-lg);
  }

  .resources-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: var(--font-size-2xl);
  }

  .contact-method {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-md);
  }

  .info-card {
    padding: var(--spacing-lg);
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-card {
  animation: fadeInUp 0.5s ease-out;
}

.resource-card {
  animation: fadeInUp 0.5s ease-out;
}

.stat-item {
  animation: fadeInUp 0.3s ease-out;
}
</style>
