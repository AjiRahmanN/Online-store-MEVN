import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth' // ✅ panggil authStore

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[],
  }),
  actions: {
    async fetchCart() {
      const authStore = useAuthStore()
      //   const userId = "_"
      const userId = authStore.user?.id
      if (!userId) {
        console.warn('User belum login, tidak bisa ambil cart')
        return
      }

      const res = await axios.get(`http://localhost:3500/api/cart/${userId}`)
      this.items = res.data.cartItem || []
    },

    async addToCart(productId: string) {
      const authStore = useAuthStore()
      const userId = authStore.user?.id

      if (!userId) {
        alert('Kamu harus login dulu untuk menambahkan ke cart.')
        return
      }

      await axios.post(`http://localhost:3500/api/cart/${userId}`, { productId })
      await this.fetchCart() // refresh cart setelah tambah
    },

    async removeFromCart(productId: string) {
      const authStore = useAuthStore()
      const userId = authStore.user?.id
      if (!userId) {
        console.warn('User belum login, tidak bisa ambil cart')
        return
      }

      await axios.delete(`http://localhost:3500/api/cart/${userId}/${productId}`)
      await this.fetchCart()
    },
  },
})
