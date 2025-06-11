<template>
  <main class="terms-page">
    <h1>Terms and Conditions</h1>

    <section>
      <h2><strong>1. Acceptance of Terms</strong></h2>
      <p>
        By accessing and using Smash Here, you agree to these Terms of Use and our Privacy Policy
        without reservation.
      </p>
    </section>

    <section>
      <h2><strong>2. Definitions</strong></h2>
      <ul>
        <li><strong>User:</strong> Any person accessing the platform.</li>
        <li>
          <strong>Content:</strong> Roadmaps, steps, text, images, and other available resources.
        </li>
      </ul>
    </section>

    <section>
      <h2><strong>3. Account Access</strong></h2>
      <p>
        Creating an account requires a valid email address. You are responsible for keeping your
        login information confidential and for all activity carried out through your account.
      </p>
    </section>

    <section>
      <h2><strong>4. Intellectual Property</strong></h2>
      <p>
        All content (text, images, code) is the property of Smash Here or its contributors. You are
        not allowed to reproduce, distribute, or modify it without permission.
      </p>
    </section>

    <section>
      <h2><strong>5. Acceptable Use</strong></h2>
      <ul>
        <li>You agree not to post illegal or offensive content.</li>
        <li>You must not disrupt the platform’s operation (attacks, spam, etc.).</li>
      </ul>
    </section>

    <section>
      <h2><strong>6. Limitation of Liability</strong></h2>
      <p>
        Smash Here provides roadmaps “as is.” We do not guarantee specific results or performance
        improvements in games.
      </p>
    </section>

    <section>
      <h2><strong>7. Changes to Terms</strong></h2>
      <p>
        We reserve the right to update these Terms at any time. The online version will always be
        the most current.
      </p>
    </section>

    <section>
      <h2><strong>8. Governing Law</strong></h2>
      <p>
        These Terms are governed by French law. Any disputes will be handled by the competent courts
        of Paris, France.
      </p>
    </section>

    <section>
      <h2><strong>9. Contact</strong></h2>
      <p>
        For any questions, please contact us at&nbsp;
        <a href="mailto:smashhere@contact.com">smashhere@contact.com</a>.
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
// No script needed for this static page
</script>

<style scoped>
.terms-page {
  max-width: 800px;
  margin: var(--spacing-4xl) auto;
  padding: var(--spacing-2xl);
  background: var(--color-darker-charcoal);
  border-radius: var(--radius-md);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  line-height: 1.6;
}
.terms-page h1 {
  font-family: var(--font-primary);
  color: var(--color-gold);
  text-align: center;
  margin-bottom: var(--spacing-xl);
}
.terms-page h2 {
  font-family: var(--font-primary);
  color: var(--color-white);
  margin-top: var(--spacing-lg);
  font-weight: bold;
}
.terms-page p,
.terms-page li {
  margin-top: var(--spacing-sm);
}
.terms-page ul {
  list-style: disc;
  margin-left: var(--spacing-xl);
}
.terms-page a {
  color: var(--color-light-yellow);
  text-decoration: underline;
}
</style>
