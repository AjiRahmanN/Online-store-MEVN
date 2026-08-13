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
        :key="item.product.id"
        class="card mb-3 p-3 shadow-sm cart-item"
      >
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div class="d-flex align-items-center">
            <!-- Gambar Produk -->
            <img
              :src="`${apiBaseUrl}${item.product.imageUrl || defaultImage}`"
              alt="Product Image"
              class="rounded me-3 cart-image"
            />

            <!-- Nama dan Harga -->
            <div>
              <h5 class="mb-1">{{ item.product.name }}</h5>
              <p class="text-muted mb-0">Rp {{ item.product.price.toLocaleString() }}</p>
              <small v-if="item.qty > item.product.stock" class="text-danger">
                Stok tersisa hanya {{ item.product.stock }}
              </small>
            </div>
          </div>

          <div class="d-flex align-items-center gap-3">
            <!-- Kontrol Qty -->
            <div class="input-group input-group-sm" style="width: 120px">
              <button
                class="btn btn-outline-secondary"
                type="button"
                :disabled="item.qty <= 1"
                @click="changeQty(item, item.qty - 1)"
              >
                −
              </button>
              <input
                type="text"
                class="form-control text-center"
                :value="item.qty"
                readonly
              />
              <button
                class="btn btn-outline-secondary"
                type="button"
                :disabled="item.qty >= item.product.stock"
                @click="changeQty(item, item.qty + 1)"
              >
                +
              </button>
            </div>

            <!-- Subtotal -->
            <div class="text-end" style="min-width: 110px">
              Rp {{ (item.product.price * item.qty).toLocaleString() }}
            </div>

            <!-- Tombol Hapus -->
            <button class="btn btn-danger btn-sm" @click="removeItem(item.product.id)">
              Hapus
            </button>
          </div>
        </div>
      </div>

      <!-- Total Harga -->
      <div class="d-flex justify-content-between align-items-center mt-4">
        <h4 class="mb-0">
          Total: <span class="text-success">Rp {{ totalPrice.toLocaleString() }}</span>
        </h4>
        <button
          class="btn btn-success btn-lg"
          :disabled="hasStockIssue"
          @click="goToCheckout"
        >
          Checkout
        </button>
      </div>
      <p v-if="hasStockIssue" class="text-danger text-end mt-2">
        Ada barang di cart yang melebihi stok tersedia. Kurangi jumlahnya untuk lanjut checkout.
      </p>
      <p v-if="errorMessage" class="text-danger text-end mt-2">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore, type CartItem } from '@/stores/cart'

const cartStore = useCartStore()
const router = useRouter()

const apiBaseUrl = import.meta.env.VITE_API_URL
const defaultImage = ref('https://via.placeholder.com/100?text=No+Image')
const errorMessage = ref('')

const cartItems = computed(() => cartStore.items)
const totalPrice = computed(() => cartStore.totalPrice)
const hasStockIssue = computed(() =>
  cartItems.value.some((item) => item.qty > (item.product?.stock ?? 0)),
)

const changeQty = async (item: CartItem, newQty: number) => {
  if (newQty < 1 || newQty > item.product.stock) return
  try {
    await cartStore.updateQty(item.product.id, newQty)
  } catch (err: any) {
    errorMessage.value = err
  }
}

const removeItem = async (productId: string) => {
  await cartStore.removeFromCart(productId)
}

const goToCheckout = () => {
  router.push({ name: 'checkout' })
}

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