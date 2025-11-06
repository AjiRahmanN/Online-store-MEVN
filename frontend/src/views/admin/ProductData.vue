<template>
  <div id="productdata" class="container mt-4">
    <h3 class="text-center mb-3 text-light">Product List</h3>

    <!-- Loading -->
    <div v-if="loading" class="text-center text-light">Loading products...</div>

    <!-- Table -->
    <table v-else class="table table-dark table-striped align-middle text-center">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Price</th>
          <th>Description</th>
          <th>Image</th>
          <th>Average Rating</th>
          <th>Category</th>
          <th>Stock</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody v-if="products.length > 0">
        <tr v-for="(p, index) in products" :key="p.id">
          <th>{{ index + 1 }}</th>
          <td>{{ p.name }}</td>
          <td>Rp {{ p.price.toLocaleString() }}</td>
          <td>{{ p.description }}</td>
          <td>
            <img
              v-if="p.imageUrl"
              :src="`http://localhost:3500${p.imageUrl}`"
              alt="Product"
              width="80"
              height="80"
              class="rounded"
            />
            <span v-else>No image</span>
          </td>
          <td>{{ p.averageRating ?? '-' }}</td>
          <td>{{ p.category }}</td>
          <td>{{ p.stock }}</td>
          <td>
            <button class="btn btn-outline-danger btn-sm" @click="handleDelete(p.id)">Delete</button>
          </td>
        </tr>
      </tbody>

      <tbody v-else>
        <tr>
          <td colspan="9" class="text-center text-light">Belum ada produk tersedia.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useProductStore } from '../../stores/product'

const productStore = useProductStore() as any
const loading = ref(true)
const products = computed(() => productStore.products)

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
    alert('Produk berhasil dihapus!')
  } catch (err: any) {
    console.error(err)
    alert('Gagal menghapus produk: ' + err)
  }
}
</script>

<style scoped>
img {
  object-fit: cover;
  border: 1px solid #666;
}
</style>
