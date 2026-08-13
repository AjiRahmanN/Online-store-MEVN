<template>
  <div class="container mt-4">
    <div v-if="product" class="card p-4 shadow">
      <img
        :src="`${apiBaseUrl}${product.imageUrl}`"
        alt="Product Image"
        class="img-fluid mb-3 rounded"
      />
      <h3>{{ product.name }}</h3>
      <p class="text-muted">Rp {{ product.price.toLocaleString() }}</p>
      <p>{{ product.description }}</p>
      <p class="small" :class="product.stock > 0 ? 'text-success' : 'text-danger'">
        {{ product.stock > 0 ? `Stok tersedia: ${product.stock}` : 'Stok habis' }}
      </p>
      <button class="btn btn-success" :disabled="!product.stock" @click="addToCart(product)">
        {{ product.stock ? 'Add to Cart' : 'Stok Habis' }}
      </button>
    </div>
    <div v-else class="text-center mt-5">
      <p>Loading product...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useCartStore } from '../stores/cart'
import { useProductStore } from '../stores/product'

const route = useRoute()
const cartStore = useCartStore()
const productStore = useProductStore() as any
const product = ref<any>(null)
const apiBaseUrl = import.meta.env.VITE_API_URL

onMounted(async () => {
  try {
    const id = route.params.id as string
    const result = await productStore.fetchById(id)
    product.value = result // ✅ ubah value ref, bukan variabelnya
  } catch (err) {
    console.error('Gagal memuat produk:', err)
  }
})

const addToCart = async (p: any) => {
  try {
    await cartStore.addToCart(p.id)
    alert(`${p.name} ditambahkan ke keranjang!`)
  } catch (err: any) {
    alert(typeof err === 'string' ? err : 'Gagal menambahkan ke keranjang.')
  }
}
</script>