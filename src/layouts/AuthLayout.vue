<!-- src/layouts/AuthLayout.vue -->

<template>
  <div class="layout-auth">
    <!-- Fond animé avec motifs de combat -->
    <div class="animated-background">
      <!-- Cercles d'impact animés -->
      <div class="impact-circle impact-1"></div>
      <div class="impact-circle impact-2"></div>
      <div class="impact-circle impact-3"></div>
      <div class="impact-circle impact-4"></div>
      
      <!-- Lignes d'énergie animées -->
      <div class="energy-line energy-1"></div>
      <div class="energy-line energy-2"></div>
      <div class="energy-line energy-3"></div>
      
      <!-- Particules flottantes -->
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
      <div class="particle particle-5"></div>
      <div class="particle particle-6"></div>
    </div>

    <!-- Bouton de retour à l'accueil -->
    <router-link to="/" class="back-to-home-btn">
      <i class="pi pi-home"></i>
      <span>Back to Home</span>
    </router-link>

    <main class="auth-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout-auth {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-darker-charcoal) 0%, var(--color-charcoal) 50%, var(--color-dark-gray) 100%);
  overflow: hidden;
}

/* Fond animé avec motifs de combat */
.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

/* Cercles d'impact animés - comme des ondes de choc */
.impact-circle {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(255, 215, 0, 0.3);
  animation: impactPulse 4s ease-in-out infinite;
}

.impact-1 {
  width: 300px;
  height: 300px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.impact-2 {
  width: 200px;
  height: 200px;
  top: 60%;
  right: 15%;
  animation-delay: 1.5s;
}

.impact-3 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 20%;
  animation-delay: 3s;
}

.impact-4 {
  width: 250px;
  height: 250px;
  top: 40%;
  right: 30%;
  animation-delay: 2s;
}

@keyframes impactPulse {
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.3;
    border-color: rgba(255, 215, 0, 0.3);
  }
  50% {
    transform: scale(1.2);
    opacity: 0.6;
    border-color: rgba(255, 215, 0, 0.6);
  }
}

/* Lignes d'énergie - comme des attaques spéciales */
.energy-line {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 215, 0, 0.8) 20%, 
    rgba(247, 220, 111, 1) 50%, 
    rgba(255, 215, 0, 0.8) 80%, 
    transparent 100%
  );
  animation: energyFlow 3s linear infinite;
}

.energy-1 {
  width: 60%;
  top: 25%;
  left: -60%;
  animation-delay: 0s;
  transform: rotate(15deg);
}

.energy-2 {
  width: 80%;
  top: 65%;
  right: -80%;
  animation-delay: 1s;
  transform: rotate(-10deg);
}

.energy-3 {
  width: 70%;
  top: 45%;
  left: -70%;
  animation-delay: 2s;
  transform: rotate(5deg);
}

@keyframes energyFlow {
  0% {
    transform: translateX(0) rotate(15deg);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateX(150vw) rotate(15deg);
    opacity: 0;
  }
}

/* Particules flottantes - comme des étincelles de combat */
.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--color-gold);
  border-radius: 50%;
  animation: particleFloat 6s ease-in-out infinite;
  box-shadow: 0 0 6px var(--color-gold);
}

.particle-1 {
  top: 20%;
  left: 25%;
  animation-delay: 0s;
}

.particle-2 {
  top: 40%;
  right: 20%;
  animation-delay: 1s;
}

.particle-3 {
  bottom: 30%;
  left: 15%;
  animation-delay: 2s;
}

.particle-4 {
  top: 70%;
  left: 60%;
  animation-delay: 3s;
}

.particle-5 {
  top: 15%;
  right: 40%;
  animation-delay: 4s;
}

.particle-6 {
  bottom: 20%;
  right: 25%;
  animation-delay: 5s;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translateY(-20px) scale(1.2);
    opacity: 1;
  }
  50% {
    transform: translateY(-10px) scale(0.8);
    opacity: 0.8;
  }
  75% {
    transform: translateY(-30px) scale(1.1);
    opacity: 1;
  }
}

.auth-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1500px;
  padding: var(--spacing-lg);
}

/* Bouton de retour à l'accueil */
.back-to-home-btn {
  position: fixed;
  top: var(--spacing-xl);
  left: var(--spacing-xl);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: rgba(37, 37, 37, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: var(--radius-full);
  color: var(--color-cream);
  text-decoration: none;
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.back-to-home-btn:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: var(--color-gold);
  color: var(--color-gold);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.2);
}

.back-to-home-btn i {
  font-size: var(--font-size-base);
  transition: color 0.3s ease;
}

.back-to-home-btn:hover i {
  color: var(--color-gold);
}

/* Responsive pour mobile */
@media (max-width: 768px) {
  .back-to-home-btn {
    top: var(--spacing-lg);
    left: var(--spacing-lg);
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .back-to-home-btn span {
    display: none;
  }

  /* Réduire l'intensité des animations sur mobile pour les performances */
  .impact-circle {
    animation-duration: 6s;
  }
  
  .energy-line {
    animation-duration: 4s;
  }
  
  .particle {
    animation-duration: 8s;
  }
}

@media (max-width: 480px) {
  .back-to-home-btn {
    top: var(--spacing-md);
    left: var(--spacing-md);
    padding: var(--spacing-sm);
    border-radius: 50%;
    width: 44px;
    height: 44px;
    justify-content: center;
  }

  /* Masquer certaines animations sur très petits écrans */
  .energy-line {
    display: none;
  }
  
  .particle:nth-child(n+4) {
    display: none;
  }
}

/* Mode réduit pour les utilisateurs préférant moins d'animations */
@media (prefers-reduced-motion: reduce) {
  .impact-circle,
  .energy-line,
  .particle {
    animation: none;
  }
  
  .impact-circle {
    opacity: 0.2;
  }
  
  .energy-line {
    opacity: 0.1;
  }
  
  .particle {
    opacity: 0.3;
  }
}
</style>