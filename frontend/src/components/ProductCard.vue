<template>
  <div class="product-container">
      <div v-for="(p) in products" :key="p.id" class="card">
          <router-link
                :to="{ name: 'product-detail', params: { id: p.id } }"
                class="card-link"
              >
          <img :src="`http://localhost:3500${p.imageUrl}`" class="card-img-top" alt="Product Image" />
          <div class="card-body">
              <h5 class="card-title">{{ p.name }}</h5>
              <p class="card-text">{{ truncate(p.description, 80) }}</p>
              <button class="btn btn-primary" @click="addToCart(p.id)">Add to Cart</button>
            </div>
        </router-link>
        </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useProductStore } from '../stores/product'
import { useCartStore } from '../stores/cart'

const productStore = useProductStore() as any
const cartStore = useCartStore() as any
const loading = ref(true)
const products = computed(() => productStore.products)

// Fungsi potong teks deskripsi
const truncate = (text: string, length: number) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Fungsi tambah ke keranjang
const addToCart = ( product: any) => {
  try {
    cartStore.addToCart(product)
    alert(`${product.name} berhasil ditambahkan ke keranjang!`)
  } catch (err: any) {
    console.error('Gagal menambah ke keranjang:', err)
    alert('Terjadi kesalahan saat menambahkan ke keranjang.')
  }
}

onMounted(async () => {
  try {
    await productStore.fetchAll()
  } catch (err: any) {
    console.error('Error fetching products:', err)
    alert('Gagal memuat produk: ' + err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* 🔹 Kontainer flex agar produk berjejer ke samping */
.product-container {
  display: flex;
  flex-wrap: wrap; /* Supaya otomatis turun ke bawah kalau penuh */
  justify-content: flex-start;
  gap: 20px; /* Jarak antar kartu */
  padding: 20px;
}

/* 🔹 Styling kartu produk */
.card {
  width: 18rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

/* 🔹 Gambar produk */
.card-img-top {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

/* 🔹 Konten dalam kartu */
.card-body {
  padding: 15px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: bold;
}

.card-text {
  font-size: 0.9rem;
  color: #555;
  min-height: 50px;
  margin-bottom: 10px;
}

/* 🔹 Tombol */
.btn {
  width: 100%;
}
</style>
