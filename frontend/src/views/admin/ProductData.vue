<template>
  <div class="mx-auto max-w-6xl px-4 py-10 lg:px-8">
    <div class="mb-6 flex items-end justify-between gap-3">
      <div>
        <p class="race-mono text-xs font-bold tracking-widest text-circuit-red uppercase">// Manajemen Gudang</p>
        <h1 class="font-display text-3xl font-bold tracking-wide text-steel-white uppercase">Daftar Produk</h1>
      </div>
      <router-link :to="{ name: 'TambahProduct' }" class="btn-race px-4 py-2 text-sm">
        + Tambah Produk
      </router-link>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <div class="h-10 w-10 animate-spin rounded-full border-2 border-track-yellow border-t-transparent"></div>
    </div>

    <div v-else-if="products.length === 0" class="spec-card px-6 py-16 text-center">
      <p class="font-display text-lg font-bold uppercase">Gudang Masih Kosong</p>
      <p class="mt-1 text-sm text-asphalt/60">Belum ada produk terdaftar.</p>
    </div>

    <div v-else class="spec-card overflow-x-auto p-0">
      <table class="w-full min-w-[800px] text-left text-sm">
        <thead>
          <tr class="border-b border-black/10 bg-asphalt-light text-steel-white">
            <th class="px-4 py-3 font-display text-xs font-bold tracking-widest uppercase">#</th>
            <th class="px-4 py-3 font-display text-xs font-bold tracking-widest uppercase">Gambar</th>
            <th class="px-4 py-3 font-display text-xs font-bold tracking-widest uppercase">Nama</th>
            <th class="px-4 py-3 font-display text-xs font-bold tracking-widest uppercase">Harga</th>
            <th class="px-4 py-3 font-display text-xs font-bold tracking-widest uppercase">Kategori</th>
            <th class="px-4 py-3 font-display text-xs font-bold tracking-widest uppercase">Stok</th>
            <th class="px-4 py-3 font-display text-xs font-bold tracking-widest uppercase">Rating</th>
            <th class="px-4 py-3 font-display text-xs font-bold tracking-widest uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, index) in products" :key="p.id" class="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
            <td class="px-4 py-3 race-mono text-asphalt/50">{{ index + 1 }}</td>
            <td class="px-4 py-3">
              <img
                v-if="p.imageUrl"
                :src="`${apiBaseUrl}${p.imageUrl}`"
                alt="Product"
                class="h-14 w-14 rounded object-cover"
              />
              <span v-else class="text-xs text-asphalt/40">Tidak ada</span>
            </td>
            <td class="max-w-48 truncate px-4 py-3 font-semibold">{{ p.name }}</td>
            <td class="race-mono px-4 py-3">Rp {{ p.price.toLocaleString() }}</td>
            <td class="px-4 py-3">
              <span v-if="p.category" class="corner-cut bg-asphalt/10 px-2 py-0.5 text-xs font-semibold">
                {{ p.category }}
              </span>
              <span v-else class="text-asphalt/40">—</span>
            </td>
            <td class="race-mono px-4 py-3" :class="p.stock > 0 ? '' : 'text-circuit-red'">
              {{ p.stock ?? 0 }}
            </td>
            <td class="px-4 py-3">{{ p.averageRating ?? '-' }}</td>
            <td class="px-4 py-3">
              <button
                type="button"
                class="corner-cut border-2 border-circuit-red px-3 py-1.5 text-xs font-bold tracking-wide text-circuit-red uppercase hover:bg-circuit-red hover:text-steel-white"
                @click="handleDelete(p.id)"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useProductStore } from '../../stores/product'

const productStore = useProductStore() as any
const loading = ref(true)
const products = computed(() => productStore.products)
const apiBaseUrl = import.meta.env.VITE_API_URL

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

async function handleDelete(id: string) {
  if (!confirm('Yakin ingin menghapus produk ini?')) return

  try {
    await productStore.deleteProduct(id)
  } catch (err: any) {
    console.error(err)
    alert('Gagal menghapus produk: ' + err)
  }
}
</script>