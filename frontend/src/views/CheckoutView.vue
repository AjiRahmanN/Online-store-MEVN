<template>
  <div class="container mt-4" style="max-width: 700px">
    <h2 class="mb-3">Checkout</h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="cartItems.length === 0" class="alert alert-warning">
      Cart kamu kosong, tidak ada yang bisa di-checkout.
      <router-link :to="{ name: 'home' }">Belanja dulu yuk</router-link>.
    </div>

    <template v-else>
      <!-- Alamat Pengiriman -->
      <div class="card mb-3 shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="mb-0">📍 Alamat Pengiriman</h6>
            <button type="button" class="btn btn-sm btn-outline-success" @click="openAdd">
              + Tambah Alamat
            </button>
          </div>

          <div v-if="addresses.length === 0" class="text-muted small">
            Kamu belum punya alamat tersimpan. Tambahkan dulu sebelum checkout.
          </div>

          <div
            v-for="addr in addresses"
            :key="addr.id"
            class="form-check border rounded p-2 mb-2"
            :class="{ 'border-success bg-light': selectedAddressId === addr.id }"
          >
            <input
              class="form-check-input"
              type="radio"
              :id="`addr-${addr.id}`"
              :value="addr.id"
              v-model="selectedAddressId"
            />
            <label class="form-check-label w-100" :for="`addr-${addr.id}`" style="cursor: pointer">
              <span class="badge bg-secondary me-2">{{ addr.label }}</span>
              <span v-if="addr.isDefault" class="badge bg-success me-2">Utama</span>
              <div class="fw-bold">{{ addr.recipientName }} — {{ addr.phone }}</div>
              <div class="text-muted small">
                {{ addr.fullAddress }}, {{ addr.city }}, {{ addr.province }} {{ addr.postalCode }}
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Ringkasan Pesanan -->
      <div class="card mb-3 shadow-sm">
        <div class="card-body">
          <h6 class="mb-3">🛒 Ringkasan Pesanan</h6>
          <div
            v-for="item in cartItems"
            :key="item.product.id"
            class="d-flex justify-content-between align-items-center mb-2"
          >
            <div class="d-flex align-items-center">
              <img
                :src="`${apiBaseUrl}${item.product.imageUrl}`"
                width="48"
                height="48"
                class="rounded me-2"
                style="object-fit: cover"
              />
              <div>
                <div>{{ item.product.name }}</div>
                <small class="text-muted">{{ item.qty }} × Rp {{ item.product.price.toLocaleString() }}</small>
              </div>
            </div>
            <div>Rp {{ (item.product.price * item.qty).toLocaleString() }}</div>
          </div>
          <hr />
          <div class="d-flex justify-content-between fw-bold fs-5">
            <span>Total</span>
            <span>Rp {{ totalPrice.toLocaleString() }}</span>
          </div>
          <p class="text-muted small mb-0 mt-1">*Belum termasuk ongkos kirim</p>
        </div>
      </div>

      <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>

      <button
        class="btn btn-success btn-lg w-100"
        :disabled="!selectedAddressId || isProcessing"
        @click="placeOrder"
      >
        <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2"></span>
        Buat Pesanan
      </button>
    </template>

    <AddressFormModal v-model="showModal" :editing="null" @saved="onAddressSaved" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { useAddressStore } from '@/stores/address'
import AddressFormModal from '@/components/AddressFormModal.vue'

const cartStore = useCartStore()
const orderStore = useOrderStore()
const addressStore = useAddressStore()
const router = useRouter()

const apiBaseUrl = import.meta.env.VITE_API_URL
const loading = ref(true)
const cartItems = computed(() => cartStore.items)
const totalPrice = computed(() => cartStore.totalPrice)
const addresses = computed(() => addressStore.addresses)
const isProcessing = computed(() => orderStore.isProcessing)

const selectedAddressId = ref<string>('')
const showModal = ref(false)
const errorMessage = ref('')

const openAdd = () => {
  showModal.value = true
}

const onAddressSaved = () => {
  // Otomatis pilih alamat yang baru ditambahkan (paling atas di list setelah refetch)
  const latest = addressStore.addresses[0]
  if (latest) selectedAddressId.value = latest.id
}

const placeOrder = async () => {
  errorMessage.value = ''
  if (!selectedAddressId.value) {
    errorMessage.value = 'Pilih alamat pengiriman terlebih dahulu.'
    return
  }
  try {
    const order = await orderStore.checkout(selectedAddressId.value)
    cartStore.clearLocalCart()
    router.push({ name: 'order-history', query: { success: order.orderId } })
  } catch (err: any) {
    errorMessage.value = typeof err === 'string' ? err : 'Checkout gagal, coba lagi.'
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([cartStore.fetchCart(), addressStore.fetchAddresses()])
    const def = addressStore.defaultAddress
    if (def) selectedAddressId.value = def.id
  } finally {
    loading.value = false
  }
})
</script>
