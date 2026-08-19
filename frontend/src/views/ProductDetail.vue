<template>
  <div class="mx-auto max-w-6xl px-4 py-10 lg:px-8">
    <div v-if="product" class="grid gap-8 lg:grid-cols-2">
      <!-- Gambar -->
      <div class="spec-card relative overflow-hidden">
        <span v-if="!product.stock" class="ribbon-badge">Habis</span>
        <img
          :src="`${apiBaseUrl}${product.imageUrl}`"
          :alt="product.name"
          class="aspect-square w-full bg-asphalt-lighter object-cover"
        />
      </div>

      <!-- Lembar spesifikasi -->
      <div>
        <span v-if="product.category" class="race-mono text-xs font-bold tracking-widest text-circuit-red uppercase">
          {{ product.category }}
        </span>
        <h1 class="mt-1 font-display text-3xl font-bold tracking-tight text-steel-white uppercase">
          {{ product.name }}
        </h1>

        <p class="race-mono mt-4 text-3xl font-bold text-track-yellow">
          Rp {{ product.price?.toLocaleString() }}
        </p>

        <!-- Gauge stok -->
        <div class="mt-5">
          <div class="mb-1 flex items-center justify-between text-xs font-semibold tracking-wide text-chrome uppercase">
            <span>Stok Gudang</span>
            <span class="race-mono" :class="product.stock > 0 ? 'text-turbo-cyan' : 'text-circuit-red'">
              {{ product.stock > 0 ? `${product.stock} unit` : 'Habis' }}
            </span>
          </div>
          <div class="h-2 w-full overflow-hidden rounded-full bg-asphalt-light">
            <div
              class="h-full rounded-full transition-all"
              :class="product.stock > 5 ? 'bg-turbo-cyan' : 'bg-circuit-red'"
              :style="{ width: `${Math.min(100, (product.stock / 20) * 100)}%` }"
            ></div>
          </div>
        </div>

        <p class="mt-6 leading-relaxed text-chrome">
          {{ product.description }}
        </p>

        <!-- Qty stepper -->
        <div class="mt-6 flex items-center gap-3">
          <span class="text-sm font-semibold tracking-wide text-chrome uppercase">Jumlah</span>
          <div class="flex items-center border border-white/15">
            <button
              type="button"
              class="h-10 w-10 text-lg font-bold text-steel-white hover:bg-asphalt-light disabled:opacity-30"
              :disabled="qty <= 1"
              @click="qty > 1 && qty--"
            >
              −
            </button>
            <span class="race-mono w-10 text-center text-sm font-bold text-steel-white">{{ qty }}</span>
            <button
              type="button"
              class="h-10 w-10 text-lg font-bold text-steel-white hover:bg-asphalt-light disabled:opacity-30"
              :disabled="qty >= product.stock"
              @click="qty < product.stock && qty++"
            >
              +
            </button>
          </div>
        </div>

        <button
          class="btn-race mt-6 w-full py-3.5 text-base"
          :disabled="!product.stock"
          @click="addToCart(product)"
        >
          {{ product.stock ? 'Masukkan Keranjang' : 'Stok Habis' }}
        </button>
        <p v-if="feedback" class="mt-3 text-sm text-turbo-cyan">{{ feedback }}</p>
      </div>
    </div>

    <div v-else class="flex justify-center py-20">
      <div class="h-10 w-10 animate-spin rounded-full border-2 border-track-yellow border-t-transparent"></div>
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
const qty = ref(1)
const feedback = ref('')
const apiBaseUrl = import.meta.env.VITE_API_URL

onMounted(async () => {
  try {
    const id = route.params.id as string
    const result = await productStore.fetchById(id)
    product.value = result
  } catch (err) {
    console.error('Gagal memuat produk:', err)
  }
})

const addToCart = async (p: any) => {
  feedback.value = ''
  try {
    await cartStore.addToCart(p.id, qty.value)
    feedback.value = `${qty.value} × ${p.name} masuk ke keranjang!`
  } catch (err: any) {
    alert(typeof err === 'string' ? err : 'Gagal menambahkan ke keranjang.')
  }
}
</script>