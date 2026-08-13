import { defineStore } from 'pinia'
import { useApiPrivate } from '@/composables/useApi'

// Deklarasi supaya TypeScript tidak error saat memanggil window.snap
// (snap.js dimuat lewat <script> di index.html)
declare global {
  interface Window {
    snap: any
  }
}

export interface OrderItem {
  product: string
  name: string
  price: number
  qty: number
  imageUrl: string
}

export interface Order {
  id: string
  orderId: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled'
  paymentType?: string
  shippingAddress?: {
    label: string
    recipientName: string
    phone: string
    fullAddress: string
    city: string
    province: string
    postalCode: string
  }
  createdAt: string
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as Order[],
    isProcessing: false,
  }),
  actions: {
    // Buat order dari cart + tampilkan popup pembayaran Midtrans Snap
    async checkout(addressId: string): Promise<Order> {
      this.isProcessing = true
      try {
        const { data } = await useApiPrivate().post('/api/orders', { addressId })
        return this.openSnap(data.orderId, data.snapToken)
      } catch (error: any) {
        this.isProcessing = false
        throw error.response?.data?.message || error.message
      }
    },

    // Buka popup Snap dan tunggu hasilnya (resolve setelah status diverifikasi ke backend)
    openSnap(orderId: string, snapToken: string): Promise<Order> {
      return new Promise((resolve, reject) => {
        if (!window.snap) {
          this.isProcessing = false
          return reject('Snap.js belum termuat. Cek script di index.html.')
        }

        window.snap.pay(snapToken, {
          onSuccess: async () => {
            try {
              const order = await this.verifyOrder(orderId)
              resolve(order)
            } catch (err) {
              reject(err)
            } finally {
              this.isProcessing = false
            }
          },
          onPending: async () => {
            try {
              const order = await this.verifyOrder(orderId)
              resolve(order)
            } catch (err) {
              reject(err)
            } finally {
              this.isProcessing = false
            }
          },
          onError: () => {
            this.isProcessing = false
            reject('Pembayaran gagal diproses.')
          },
          onClose: () => {
            this.isProcessing = false
            reject('Kamu menutup popup pembayaran sebelum selesai.')
          },
        })
      })
    },

    // Cek status transaksi terbaru ke backend (backend akan tanya ke Midtrans)
    async verifyOrder(orderId: string): Promise<Order> {
      const { data } = await useApiPrivate().post(`/api/orders/${orderId}/verify`)
      return data
    },

    async cancelOrder(orderId: string): Promise<Order> {
      try {
        const { data } = await useApiPrivate().post(`/api/orders/${orderId}/cancel`)
        return data
      } catch (error: any) {
        throw error.response?.data?.message || error.message
      }
    },

    async fetchMyOrders() {
      try {
        const { data } = await useApiPrivate().get('/api/orders/mine')
        this.orders = data
      } catch (error: any) {
        console.error('Error fetching orders:', error)
        throw error.response?.data?.message || error.message
      }
    },
  },
})
