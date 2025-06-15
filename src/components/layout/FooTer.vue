<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Logo -->
      <div class="footer-logo">
        <img src="@/assets/logo.webp" alt="Logo Smash Here" />
      </div>

      <!-- Menu principal -->
      <div class="footer-menu">
        <div class="footer-column">
          <h4>Plateforme</h4>
          <ul>
            <li><router-link to="/games">Games</router-link></li>
            <li><router-link to="/roadmaps">Roadmaps</router-link></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Support</h4>
          <ul>
            <li><router-link to="/faq">FAQ</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Legal</h4>
          <ul>
            <li><router-link to="/terms-and-conditions">Terms and conditions</router-link></li>
            <li><router-link to="/general-terms-of-use">General terms of use</router-link></li>
            <li><router-link to="/privacy-policy">Privacy policy</router-link></li>
            <li><router-link to="/cookies-policy">Cookies</router-link></li>
          </ul>
        </div>
      </div>

      <!-- Réseaux sociaux -->
      <div class="footer-socials">
        <a href="#"><i class="pi pi-twitter" /></a>
        <!-- <a href="#"><i class="pi pi-discord" /></a>
        <a href="#"><i class="pi pi-reddit" /></a> -->
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-dark-gray);
  padding: var(--spacing-xl) var(--spacing-md);
  color: var(--color-light-gray);
  font-family: var(--font-secondary);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

.footer-logo img {
  height: 100px;
  width: auto;
  cursor: pointer;
}

.footer-menu {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: var(--spacing-2xl);
  flex: 1;
  min-width: 300px;
}

.footer-column h4 {
  color: var(--color-gold);
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-sm);
  font-family: var(--font-secondary);
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column li {
  margin-bottom: var(--spacing-xs);
}

.footer-column a {
  color: var(--color-light-gray);
  text-decoration: none;
  font-size: var(--font-size-sm);
}

.footer-column a:hover {
  color: var(--color-gold);
}

.footer-socials {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.footer-socials a {
  background-color: var(--color-cream);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-socials a:hover {
  opacity: 70%;
  transition: background-color 0.3s ease-in-out;
}

.footer-socials i {
  font-size: 1.2rem;
  color: var(--color-black);
}

/* Responsive */
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-menu {
    justify-content: center;
  }

  .footer-socials {
    margin-top: var(--spacing-md);
  }
}
</style>
