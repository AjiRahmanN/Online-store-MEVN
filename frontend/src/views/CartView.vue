<template>
  <div class="mx-auto max-w-4xl px-4 py-10 lg:px-8">
    <p class="race-mono text-xs font-bold tracking-widest text-circuit-red uppercase">// Garasi Belanja</p>
    <h1 class="mb-6 font-display text-3xl font-bold tracking-wide text-steel-white uppercase">Keranjang</h1>

    <!-- Jika kosong -->
    <div v-if="cartItems.length === 0" class="spec-card px-6 py-16 text-center">
      <p class="font-display text-lg font-bold uppercase">Keranjang Masih Kosong</p>
      <p class="mt-1 text-sm text-asphalt/60">Belum ada part yang kamu pilih.</p>
      <router-link :to="{ name: 'home' }" class="btn-race mt-5 inline-flex px-5 py-2.5 text-sm">
        Ke Katalog
      </router-link>
    </div>

    <!-- Jika ada item -->
    <div v-else>
      <div v-for="item in cartItems" :key="item.product.id" class="spec-card mb-3 p-3">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex min-w-0 items-center gap-3">
            <img
              :src="`${apiBaseUrl}${item.product.imageUrl || ''}`"
              alt="Product Image"
              class="h-16 w-16 shrink-0 rounded object-cover"
            />
            <div class="min-w-0">
              <h5 class="truncate font-display text-sm font-bold">{{ item.product.name }}</h5>
              <p class="race-mono text-sm text-asphalt/70">Rp {{ item.product.price.toLocaleString() }}</p>
              <small v-if="item.qty > item.product.stock" class="text-circuit-red">
                Stok tersisa hanya {{ item.product.stock }}
              </small>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- Kontrol Qty -->
            <div class="flex items-center border border-black/15">
              <button
                type="button"
                class="h-8 w-8 font-bold text-asphalt hover:bg-asphalt/10 disabled:opacity-30"
                :disabled="item.qty <= 1"
                @click="changeQty(item, item.qty - 1)"
              >
                −
              </button>
              <span class="race-mono w-8 text-center text-sm font-bold">{{ item.qty }}</span>
              <button
                type="button"
                class="h-8 w-8 font-bold text-asphalt hover:bg-asphalt/10 disabled:opacity-30"
                :disabled="item.qty >= item.product.stock"
                @click="changeQty(item, item.qty + 1)"
              >
                +
              </button>
            </div>

            <!-- Subtotal -->
            <div class="race-mono w-28 text-right text-sm font-bold">
              Rp {{ (item.product.price * item.qty).toLocaleString() }}
            </div>

            <!-- Tombol Hapus -->
            <button
              type="button"
              class="corner-cut bg-circuit-red px-3 py-2 text-xs font-bold text-steel-white uppercase hover:bg-circuit-red-dark"
              @click="removeItem(item.product.id)"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>

      <!-- Total Harga -->
      <div class="spec-card mt-6 flex flex-wrap items-center justify-between gap-4 p-4">
        <div>
          <p class="text-xs font-semibold tracking-widest text-asphalt/50 uppercase">Total Belanja</p>
          <p class="race-mono text-2xl font-bold text-circuit-red">Rp {{ totalPrice.toLocaleString() }}</p>
        </div>
        <button class="btn-race px-6 py-3" :disabled="hasStockIssue" @click="goToCheckout">
          Checkout
        </button>
      </div>
      <p v-if="hasStockIssue" class="mt-2 text-right text-sm text-circuit-red">
        Ada barang di cart yang melebihi stok tersedia. Kurangi jumlahnya untuk lanjut checkout.
      </p>
      <p v-if="errorMessage" class="mt-2 text-right text-sm text-circuit-red">{{ errorMessage }}</p>
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