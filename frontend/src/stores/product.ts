import { defineStore } from 'pinia'
import { useApi, useApiPrivate } from '../composables/useApi.ts'

export interface Product {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  averageRating?: number
  category: string
  stock: number
  createdAt?: string
  updatedAt?: string
}

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    selectedProduct: null as Product | null,
  }),

  getters: {
    allProducts: (state) => state.products,
    productDetail: (state) => state.selectedProduct,
  },

  actions: {
    // 🧭 Ambil semua produk
    async fetchAll(): Promise<any> {
      try {
        const { data } = await useApi().get('/api/products')
        this.products = data
        return data
      } catch (error: any) {
        console.error('Error fetching products:', error)
        throw error.response?.data?.message || error.message
      }
    },

    // 🔍 Ambil produk berdasarkan ID
    async fetchById(id: string): Promise<any> {
      try {
        const { data } = await useApi().get(`/api/products/${id}`)
        this.selectedProduct = data
        return data
      } catch (error: any) {
        console.error('Error fetching product:', error)
        throw error.response?.data?.message || error.message
      }
    },

    // ➕ Tambah produk baru (butuh autentikasi admin)
    async addProduct(formData: FormData): Promise<any> {
      try {
        const { data } = await useApiPrivate().post('/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        // Tambahkan produk baru ke state
        this.products.push(data)
        return data
      } catch (error: any) {
        console.error('Error adding product:', error)
        throw error.response?.data?.message || error.message
      }
    },

    // ✏️ Update produk
    async updateProduct(id: string, payload: Partial<Product>): Promise<any> {
      try {
        const { data } = await useApiPrivate().put(`/api/products/${id}`, payload)
        // Update produk di state
        const index = this.products.findIndex((p) => p.id === id)
        if (index !== -1) this.products[index] = data
        return data
      } catch (error: any) {
        console.error('Error updating product:', error)
        throw error.response?.data?.message || error.message
      }
    },

    // ❌ Hapus produk
    async deleteProduct(id: string): Promise<any> {
      try {
        const { data } = await useApiPrivate().delete(`/api/products/${id}`)
        this.products = this.products.filter((p) => p.id !== id)
        return data
      } catch (error: any) {
        console.error('Error deleting product:', error)
        throw error.response?.data?.message || error.message
      }
    },
  },

  persist: true, // simpan data produk di localStorage
})
