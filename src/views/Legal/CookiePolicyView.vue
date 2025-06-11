<template>
  <main class="cookies-page">
    <h1>Cookies Policy</h1>

    <section>
      <h2><strong>1. Introduction</strong></h2>
      <p>
        This Cookies Policy explains how Smash Here uses cookies and similar technologies when you
        visit our platform. We comply with the General Data Protection Regulation (GDPR) and
        ePrivacy Directive.
      </p>
    </section>

    <section>
      <h2><strong>2. What are cookies?</strong></h2>
      <p>
        Cookies are small text files stored on your device when you visit websites. They are used to
        remember your preferences, provide secure login, analyze site usage, and enhance user
        experience.
      </p>
    </section>

    <section>
      <h2><strong>3. Types of cookies we use</strong></h2>
      <ul>
        <li>
          <strong>Strictly Necessary Cookies:</strong> Required for core functionality like
          authentication and session management.
        </li>
        <li>
          <strong>Functional Cookies:</strong> Remember preferences and settings to improve your
          experience.
        </li>
        <li>
          <strong>Analytics Cookies:</strong> Help us understand how users interact with the
          platform (e.g., page visits, bounce rate).
        </li>
        <li>
          <strong>Third-Party Cookies:</strong> Set by services we integrate such as YouTube, cloud
          storage, or analytics tools.
        </li>
      </ul>
    </section>

    <section>
      <h2><strong>4. How we use cookies</strong></h2>
      <p>
        We use cookies to authenticate users, remember preferences, monitor traffic, and enhance
        performance. Some cookies are placed by third-party services that appear on our pages.
      </p>
    </section>

    <section>
      <h2><strong>5. Managing cookies</strong></h2>
      <p>
        You can manage your cookie preferences at any time via your browser settings. Most browsers
        allow you to block or delete cookies. Please note that disabling certain cookies may affect
        platform functionality.
      </p>
    </section>

    <section>
      <h2><strong>6. Cookie consent</strong></h2>
      <p>
        By using our platform, you consent to the use of cookies as described in this policy. You
        can modify your consent preferences at any time through the cookie banner or settings.
      </p>
    </section>

    <section>
      <h2><strong>7. Contact</strong></h2>
      <p>
        For any questions regarding this Cookies Policy or how we use cookies, please contact us at
        <a href="mailto:smashhere@contact.com">smashhere@contact.com</a>.
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
// No script logic needed
</script>

<style scoped>
.cookies-page {
  max-width: 800px;
  margin: var(--spacing-4xl) auto;
  padding: var(--spacing-2xl);
  background: var(--color-darker-charcoal);
  border-radius: var(--radius-md);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  line-height: 1.6;
}
.cookies-page h1 {
  font-family: var(--font-primary);
  color: var(--color-gold);
  text-align: center;
  margin-bottom: var(--spacing-xl);
}
.cookies-page h2 {
  font-family: var(--font-primary);
  color: var(--color-white);
  margin-top: var(--spacing-lg);
}
.cookies-page p,
.cookies-page li {
  margin-top: var(--spacing-sm);
}
.cookies-page ul {
  list-style: disc;
  margin-left: var(--spacing-xl);
}
.cookies-page a {
  color: var(--color-light-yellow);
  text-decoration: underline;
}
</style>
