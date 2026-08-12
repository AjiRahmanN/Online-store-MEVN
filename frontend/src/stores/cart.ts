import { defineStore } from 'pinia'
import { useApiPrivate } from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[],
  }),
  actions: {
    async fetchCart() {
      const authStore = useAuthStore()
      const userId = authStore.user?.id
      if (!userId) {
        console.warn('User belum login, tidak bisa ambil cart')
        return
      }

      try {
        const { data } = await useApiPrivate().get(`/api/cart/${userId}`)
        this.items = data.cartItem || []
      } catch (error: any) {
        console.error('Error fetching cart:', error)
        throw error.response?.data?.message || error.message
      }
    },

    async addToCart(productId: string) {
      const authStore = useAuthStore()
      const userId = authStore.user?.id

      if (!userId) {
        alert('Kamu harus login dulu untuk menambahkan ke cart.')
        return
      }

      try {
        await useApiPrivate().post(`/api/cart/${userId}`, { productId })
        await this.fetchCart() // refresh cart setelah tambah
      } catch (error: any) {
        console.error('Error adding to cart:', error)
        throw error.response?.data?.message || error.message
      }
    },

    async removeFromCart(productId: string) {
      const authStore = useAuthStore()
      const userId = authStore.user?.id
      if (!userId) {
        console.warn('User belum login, tidak bisa ambil cart')
        return
      }

      try {
        await useApiPrivate().delete(`/api/cart/${userId}/${productId}`)
        await this.fetchCart()
      } catch (error: any) {
        console.error('Error removing from cart:', error)
        throw error.response?.data?.message || error.message
      }
    },
  },
})