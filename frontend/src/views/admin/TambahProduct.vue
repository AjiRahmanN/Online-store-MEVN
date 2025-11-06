<template>
  <div class="card">
    <div class="card-body">
      <form @submit.prevent="submit">
        <div class="mb-3">
          <label class="form-label">Nama Product</label>
          <input type="text" class="form-control" v-model="productdata.name">
        </div>

        <div class="mb-3">
          <label class="form-label">Harga</label>
          <input type="number" class="form-control" v-model.number="productdata.price">
        </div>

        <div class="mb-3">
          <label class="form-label">Deskripsi</label>
          <textarea class="form-control" v-model="productdata.description"></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label">Average Rating</label>
          <input type="number" class="form-control" v-model.number="productdata.averageRating">
        </div>

        <div class="mb-3">
          <label class="form-label">Kategori</label>
          <input type="text" class="form-control" v-model="productdata.category">
        </div>

        <div class="mb-3">
          <label class="form-label">Stok</label>
          <input type="number" class="form-control" v-model.number="productdata.stock">
        </div>

        <div class="mb-3">
          <label class="form-label">Gambar</label>
          <input type="file" class="form-control" @change="handleFileUpload">
        </div>

        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useProductStore } from '../../stores/product';
import { reactive, ref } from 'vue'; 

const router = useRouter()
const productStore = useProductStore() as any

// Data produk
const productdata = reactive({
  name: '',
  price: 0,
  description: '',
  averageRating: 0,
  category: '',
  stock: 0,
})

// File gambar
const imageFile = ref<File | null>(null)

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    imageFile.value = target.files[0]
  }
}

async function submit() {
  try {
    // Buat FormData sesuai API
    const formData = new FormData()
    formData.append('name', productdata.name)
    formData.append('price', productdata.price.toString())
    formData.append('description', productdata.description)
    formData.append('averageRating', productdata.averageRating.toString())
    formData.append('category', productdata.category)
    formData.append('stock', productdata.stock.toString())
    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    // Panggil store
    await productStore.addProduct(formData)

    // Redirect ke halaman list produk admin
    router.replace({ name: 'adminproducts' })
  } catch (error: any) {
    console.error('Gagal menambahkan produk:', error)
    alert(error.response?.data?.message || error.message || 'Gagal menambahkan produk')
  }
}
</script>

<style>

</style>