<template>
  <div class="mx-auto max-w-2xl px-4 py-10 lg:px-8">
    <p class="race-mono text-xs font-bold tracking-widest text-circuit-red uppercase">// Registrasi Unit Baru</p>
    <h1 class="mb-6 font-display text-3xl font-bold tracking-wide text-steel-white uppercase">Tambah Produk</h1>

    <form @submit.prevent="submit" class="spec-card space-y-4 p-6">
      <div>
        <label for="name" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">
          Nama Produk
        </label>
        <input id="name" v-model="productdata.name" name="name" type="text" class="field-race" required />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="price" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">
            Harga (Rp)
          </label>
          <input id="price" v-model.number="productdata.price" name="price" type="number" min="0" class="field-race" required />
        </div>
        <div>
          <label for="stock" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">
            Stok
          </label>
          <input id="stock" v-model.number="productdata.stock" name="stock" type="number" min="0" class="field-race" required />
        </div>
      </div>

      <div>
        <label for="description" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">
          Deskripsi
        </label>
        <textarea id="description" v-model="productdata.description" name="description" rows="4" class="field-race resize-none"></textarea>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="category" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">
            Kategori
          </label>
          <input
            id="category"
            v-model="productdata.category"
            name="category"
            type="text"
            placeholder="Mini 4WD / RC Car / dll"
            class="field-race"
          />
        </div>
        <div>
          <label for="averageRating" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">
            Rating Awal
          </label>
          <input
            id="averageRating"
            v-model.number="productdata.averageRating"
            name="averageRating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            class="field-race"
          />
        </div>
      </div>

      <div>
        <label for="image" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">
          Gambar Produk
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          class="field-race file:mr-3 file:corner-cut file:border-0 file:bg-asphalt file:px-3 file:py-1.5 file:text-xs file:font-bold file:tracking-wide file:text-steel-white file:uppercase"
          @change="handleFileUpload"
        />
      </div>

      <button type="submit" class="btn-race w-full py-3 text-sm" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="h-4 w-4 animate-spin rounded-full border-2 border-asphalt border-t-transparent"></span>
        Simpan Produk
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useProductStore } from '../../stores/product'
import { reactive, ref } from 'vue'

const router = useRouter()
const productStore = useProductStore() as any
const isSubmitting = ref(false)

const productdata = reactive({
  name: '',
  price: 0,
  description: '',
  averageRating: 0,
  category: '',
  stock: 0,
})

const imageFile = ref<File | null>(null)

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    imageFile.value = target.files[0]
  }
}

async function submit() {
  isSubmitting.value = true
  try {
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

    await productStore.addProduct(formData)
    router.replace({ name: 'adminproducts' })
  } catch (error: any) {
    console.error('Gagal menambahkan produk:', error)
    alert(error.response?.data?.message || error.message || 'Gagal menambahkan produk')
  } finally {
    isSubmitting.value = false
  }
}
</script>