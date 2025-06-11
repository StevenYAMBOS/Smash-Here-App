<template>
  <main class="privacy-page">
    <h1>Privacy Policy</h1>

    <section>
      <h2><strong>1. Introduction</strong></h2>
      <p>
        This Privacy Policy explains how Smash Here collects, uses, and protects your personal data
        when you use our platform.
      </p>
    </section>

    <section>
      <h2><strong>2. Data Controller</strong></h2>
      <p>
        The data controller is Smash Here SAS, based in France. You can contact us at
        <a href="mailto:smashhere@contact.com">smashhere@contact.com</a>.
      </p>
    </section>

    <section>
      <h2><strong>3. Collected Data</strong></h2>
      <ul>
        <li>Username</li>
        <li>Email address</li>
        <li>Profile picture</li>
        <li>Roadmap and step progression</li>
        <li>Comments and content you submit</li>
        <li>Connection data (IP, browser, etc.)</li>
      </ul>
    </section>

    <section>
      <h2><strong>4. Data Collection Methods</strong></h2>
      <p>
        Data is collected via registration forms, interactions with the platform, and usage
        analytics. We may also use cookies to improve your experience.
      </p>
    </section>

    <section>
      <h2><strong>5. Purposes of Processing</strong></h2>
      <p>We process your data to:</p>
      <ul>
        <li>Authenticate and manage user accounts</li>
        <li>Track user progression</li>
        <li>Improve the platform experience</li>
        <li>Send notifications or emails (optional)</li>
      </ul>
    </section>

    <section>
      <h2><strong>6. Legal Basis</strong></h2>
      <p>
        We rely on your consent, the execution of a contract, and our legitimate interests to
        process your data in accordance with GDPR.
      </p>
    </section>

    <section>
      <h2><strong>7. Data Sharing</strong></h2>
      <p>
        Your data may be shared with technical service providers (e.g., AWS, OVH) for hosting and
        storage purposes. We do not sell your data.
      </p>
    </section>

    <section>
      <h2><strong>8. Data Retention</strong></h2>
      <p>
        Your personal data is retained for as long as your account is active or as required by
        applicable laws.
      </p>
    </section>

    <section>
      <h2><strong>9. Your Rights</strong></h2>
      <p>
        In accordance with GDPR, you have the right to access, rectify, erase, object to or restrict
        the processing of your data, and the right to data portability. You may exercise your rights
        by contacting us at <a href="mailto:smashhere@contact.com">smashhere@contact.com</a>.
      </p>
    </section>

    <section>
      <h2><strong>10. Cookies</strong></h2>
      <p>
        We may use essential cookies for the functionality of the platform. You will be informed and
        asked for consent when necessary.
      </p>
    </section>

    <section>
      <h2><strong>11. Security Measures</strong></h2>
      <p>
        We implement technical and organizational measures to protect your data, including
        encryption, access restrictions, and secure hosting.
      </p>
    </section>

    <section>
      <h2><strong>12. Changes to This Policy</strong></h2>
      <p>
        We may update this Privacy Policy at any time. Any changes will be published on this page
        and notified to you if necessary.
      </p>
    </section>

    <section>
      <h2><strong>13. Contact</strong></h2>
      <p>
        If you have any questions about this Privacy Policy or your data, please contact us at&nbsp;
        <a href="mailto:smashhere@contact.com">smashhere@contact.com</a>.
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
// Static legal content – no logic needed
</script>

<style scoped>
.privacy-page {
  max-width: 800px;
  margin: var(--spacing-4xl) auto;
  padding: var(--spacing-2xl);
  background: var(--color-darker-charcoal);
  border-radius: var(--radius-md);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  line-height: 1.6;
}
.privacy-page h1 {
  font-family: var(--font-primary);
  color: var(--color-gold);
  text-align: center;
  margin-bottom: var(--spacing-xl);
}
.privacy-page h2 {
  font-family: var(--font-primary);
  color: var(--color-white);
  margin-top: var(--spacing-lg);
}
.privacy-page p,
.privacy-page li {
  margin-top: var(--spacing-sm);
}
.privacy-page ul {
  list-style: disc;
  margin-left: var(--spacing-xl);
}
.privacy-page a {
  color: var(--color-light-yellow);
  text-decoration: underline;
}
</style>
