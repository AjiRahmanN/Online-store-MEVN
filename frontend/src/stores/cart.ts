import { defineStore } from 'pinia'
import { useApiPrivate } from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth'

export interface CartItem {
  product: {
    id: string
    name: string
    price: number
    imageUrl: string
    stock: number
  }
  qty: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, i) => sum + i.qty, 0),
    totalPrice: (state) => state.items.reduce((sum, i) => sum + (i.product?.price || 0) * i.qty, 0),
  },
  actions: {
    async fetchCart() {
      const authStore = useAuthStore()
      const userId = authStore.user?.id
      if (!userId) {
        this.items = []
        return
      }

      try {
        const { data } = await useApiPrivate().get(`/api/cart/${userId}`)
        this.items = data.items || []
      } catch (error: any) {
        console.error('Error fetching cart:', error)
        throw error.response?.data?.message || error.message
      }
    },

    async addToCart(productId: string, qty: number = 1) {
      const authStore = useAuthStore()
      const userId = authStore.user?.id

      if (!userId) {
        alert('Kamu harus login dulu untuk menambahkan ke cart.')
        return
      }

      try {
        const { data } = await useApiPrivate().post(`/api/cart/${userId}`, { productId, qty })
        this.items = data.items || []
      } catch (error: any) {
        console.error('Error adding to cart:', error)
        throw error.response?.data?.message || error.message
      }
    },

    async updateQty(productId: string, qty: number) {
      const authStore = useAuthStore()
      const userId = authStore.user?.id
      if (!userId) return

      try {
        const { data } = await useApiPrivate().patch(`/api/cart/${userId}/${productId}`, { qty })
        this.items = data.items || []
      } catch (error: any) {
        console.error('Error updating qty:', error)
        throw error.response?.data?.message || error.message
      }
    },

    async removeFromCart(productId: string) {
      const authStore = useAuthStore()
      const userId = authStore.user?.id
      if (!userId) return

      try {
        await useApiPrivate().delete(`/api/cart/${userId}/${productId}`)
        await this.fetchCart()
      } catch (error: any) {
        console.error('Error removing from cart:', error)
        throw error.response?.data?.message || error.message
      }
    },

    // Dipanggil setelah checkout sukses supaya badge cart langsung update
    clearLocalCart() {
      this.items = []
    },
  },
})
