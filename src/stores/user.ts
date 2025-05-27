// src/stores/user.ts

import { defineStore } from 'pinia'
import type { User } from '@/types/collections'

export const useUserStore = defineStore('user', {
  state: () => ({
    // Si un token existe dans localStorage, on l'utilise
    token: (localStorage.getItem('token') ?? '') as string,
    profile: null as User | null,
  }),
  actions: {
    setToken(t: string) {
      this.token = t
      localStorage.setItem('token', t)
    },
    clear() {
      this.token = ''
      this.profile = null
      localStorage.removeItem('token')
    },
    async fetchProfile() {
      if (!this.token) return
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/user/profile`,
          { headers: { Authorization: `Bearer ${this.token}` } },
        )
        if (res.ok) {
          this.profile = await res.json()
        } else {
          // token invalide, on efface
          this.clear()
        }
      } catch {
        this.clear()
      }
    },
  },
})
