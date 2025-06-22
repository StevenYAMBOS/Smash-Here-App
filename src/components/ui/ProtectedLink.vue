<!-- src/components/ui/ProtectedLink.vue -->

<!-- <template>
  <router-link v-if="userStore.isAuthenticated" :to="to" :class="linkClass" v-bind="$attrs">
    <slot />
  </router-link>

  <button v-else @click="handleUnauthenticatedClick" :class="buttonClass" v-bind="$attrs">
    <slot />
  </button>
</template> -->

<!-- <script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

// Props
defineProps<{
  to: string | object
  linkClass?: string
  buttonClass?: string
  showToast?: boolean
  toastMessage?: string
}>()

// Composables
const userStore = useUserStore()
const router = useRouter()
const toast = useToast()

// Gestion du clic pour utilisateur non connecté
const handleUnauthenticatedClick = () => {
  const props = getCurrentInstance()?.props as any

  // Stocker la destination pour redirection après connexion
  sessionStorage.setItem(
    'redirectAfterLogin',
    typeof props.to === 'string' ? props.to : props.to.path,
  )

  // Afficher un toast si demandé
  if (props.showToast !== false) {
    toast.warning(props.toastMessage || 'Please log in to access this feature')
  }

  // Rediriger vers la page de connexion
  router.push({
    name: 'login',
    query: {
      redirect: typeof props.to === 'string' ? props.to : props.to.path,
    },
  })
}
</script> -->

<!-- <style scoped>
/* Le composant hérite des styles du parent */
button {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  text-decoration: inherit;
  color: inherit;
}
</style> -->
