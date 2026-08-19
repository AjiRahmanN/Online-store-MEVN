<template>
  <div>
    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <div v-for="n in 8" :key="n" class="corner-cut h-64 animate-pulse bg-asphalt-light"></div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="products.length === 0"
      class="spec-card flex flex-col items-center gap-2 px-6 py-16 text-center"
    >
      <p class="font-display text-lg font-bold uppercase">Garasi Masih Kosong</p>
      <p class="text-sm text-asphalt/60">Belum ada produk yang tersedia saat ini. Cek lagi nanti ya.</p>
    </div>

    <template v-else>
      <!-- Filter kategori (dinamis dari data produk) -->
      <div v-if="categories.length > 1" class="mb-6 flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          class="corner-cut border px-3 py-1.5 font-display text-xs font-bold tracking-wide uppercase transition-colors"
          :class="
            activeCategory === cat
              ? 'border-track-yellow bg-track-yellow text-asphalt'
              : 'border-white/15 bg-asphalt-light text-chrome hover:border-track-yellow hover:text-track-yellow'
          "
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Grid produk -->
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <router-link
          v-for="p in filteredProducts"
          :key="p.id"
          :to="{ name: 'product-detail', params: { id: p.id } }"
          class="spec-card group relative flex flex-col overflow-hidden"
        >
          <span v-if="!p.stock" class="ribbon-badge">Habis</span>
          <span v-else-if="p.stock <= 5" class="ribbon-badge bg-turbo-cyan text-asphalt">Sisa {{ p.stock }}</span>

          <div class="aspect-square w-full overflow-hidden bg-asphalt-lighter">
            <img
              :src="`${apiBaseUrl}${p.imageUrl}`"
              :alt="p.name"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div class="flex flex-1 flex-col gap-1 p-3">
            <span v-if="p.category" class="race-mono text-[10px] font-bold tracking-widest text-circuit-red uppercase">
              {{ p.category }}
            </span>
            <h3 class="line-clamp-2 font-display text-sm leading-tight font-bold text-asphalt">
              {{ p.name }}
            </h3>
            <p class="race-mono mt-auto pt-2 text-base font-bold text-asphalt">
              Rp {{ p.price?.toLocaleString() }}
            </p>

            <button
              type="button"
              class="btn-race mt-2 w-full py-2 text-xs"
              :disabled="!p.stock"
              @click.prevent.stop="addToCart(p)"
            >
              {{ p.stock ? '+ Keranjang' : 'Stok Habis' }}
            </button>
          </div>
        </router-link>
      </div>
    </template>
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
const apiBaseUrl = import.meta.env.VITE_API_URL

const activeCategory = ref<string>('Semua')
const categories = computed<string[]>(() => {
  const unique = Array.from(
    new Set(
      (products.value as any[]).map((p) => p.category as string).filter(Boolean),
    ),
  ) as string[]
  return unique.length ? ['Semua', ...unique] : []
})
const filteredProducts = computed(() => {
  if (activeCategory.value === 'Semua') return products.value
  return products.value.filter((p: any) => p.category === activeCategory.value)
})

const addToCart = async (product: any) => {
  try {
    await cartStore.addToCart(product.id)
  } catch (err: any) {
    console.error('Gagal menambah ke keranjang:', err)
    alert(typeof err === 'string' ? err : 'Terjadi kesalahan saat menambahkan ke keranjang.')
  }
}

onMounted(async () => {
  try {
    await productStore.fetchAll()
  } catch (err: any) {
    console.error('Error fetching products:', err)
  } finally {
    loading.value = false
  }
})
</script>