<template>
  <main class="terms-page">
    <h1>General Terms of Use</h1>

    <section>
      <h2><strong>1. Introduction</strong></h2>
      <p>
        These General Terms of Use ("Terms") govern access and use of the Smash Here platform,
        operated by Smash Here SAS. By using the site, you agree to be bound by these Terms.
      </p>
    </section>

    <section>
      <h2><strong>2. Access to the Platform</strong></h2>
      <p>
        Access is reserved for users aged 13 or older. Some features require account creation.
        Access may be suspended for maintenance or in case of violation.
      </p>
    </section>

    <section>
      <h2><strong>3. User Obligations</strong></h2>
      <ul>
        <li>Respect others and the platform rules.</li>
        <li>Do not post illegal, violent, or hateful content.</li>
        <li>Do not attempt to hack, overload, or disrupt the platform.</li>
      </ul>
    </section>

    <section>
      <h2><strong>4. Account Management</strong></h2>
      <p>
        You are responsible for the confidentiality of your account. Smash Here reserves the right
        to delete or suspend any account in case of abuse.
      </p>
    </section>

    <section>
      <h2><strong>5. Intellectual Property</strong></h2>
      <p>
        All site content (text, design, visuals, logos, etc.) is protected. Reproduction without
        prior permission is prohibited.
      </p>
    </section>

    <section>
      <h2><strong>6. User-Generated Content</strong></h2>
      <p>
        Users may publish roadmaps, steps, or comments. You are responsible for your publications.
        Smash Here may moderate or delete content that violates the rules.
      </p>
    </section>

    <section>
      <h2><strong>7. Limitation of Liability</strong></h2>
      <p>
        Smash Here is not responsible for malfunctions, bugs, or loss of data. The platform is
        provided “as is” without warranty.
      </p>
    </section>

    <section>
      <h2><strong>8. Termination</strong></h2>
      <p>
        In case of breach of these Terms, your access may be permanently revoked, with or without
        notice.
      </p>
    </section>

    <section>
      <h2><strong>9. Modifications of the Terms</strong></h2>
      <p>
        These Terms may be updated at any time. Users will be notified of major changes. Continued
        use implies acceptance of the updated terms.
      </p>
    </section>

    <section>
      <h2><strong>10. Applicable Law & Jurisdiction</strong></h2>
      <p>
        These Terms are governed by French law. Any disputes will fall under the exclusive
        jurisdiction of the courts of Paris, France.
      </p>
    </section>

    <section>
      <h2><strong>11. Contact</strong></h2>
      <p>
        For any inquiries, please contact us at&nbsp;
        <a href="mailto:smashhere@contact.com">smashhere@contact.com</a>.
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
// Static legal page – no logic needed
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
