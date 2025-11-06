<template>
  <div class="container mt-4">
    <h2 class="mb-3">🛒 Your Cart</h2>

    <!-- Jika kosong -->
    <div v-if="cartItems.length === 0" class="alert alert-info text-center">
      Cart kamu masih kosong 😢
    </div>

    <!-- Jika ada item -->
    <div v-else>
      <div
        v-for="item in cartItems"
        :key="item._id"
        class="card mb-3 p-3 shadow-sm cart-item"
      >
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <!-- Gambar Produk -->
            <img
              :src="`http://localhost:3500${ item.imageUrl || defaultImage}`"
              alt="Product Image"
              class="rounded me-3 cart-image"
            />

            <!-- Nama dan Harga -->
            <div>
              <h5 class="mb-1">{{ item.name }}</h5>
              <p class="text-muted mb-0">Rp {{ item.price.toLocaleString() }}</p>
            </div>
          </div>

          <!-- Tombol Hapus -->
          <button class="btn btn-danger btn-sm" @click="removeItem(item._id)">
            Hapus
          </button>
        </div>
      </div>

      <!-- Total Harga -->
      <div class="text-end mt-4">
        <h4>Total: <span class="text-success">Rp {{ totalPrice.toLocaleString() }}</span></h4>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
const defaultImage = ref('https://via.placeholder.com/100?text=No+Image') // default jika tidak ada gambar

// ambil cartItems dari store
const cartItems = computed(() => cartStore.items)

// total harga
const totalPrice = computed(() =>
  cartItems.value.reduce((acc, item) => acc + (item.price || 0), 0)
)

const removeItem = async (id: string) => {
  await cartStore.removeFromCart(id)
}

// ambil data saat halaman dimuat
onMounted(() => {
  cartStore.fetchCart()
})
</script>

<style scoped>
.cart-item {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.cart-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
}
</style>
