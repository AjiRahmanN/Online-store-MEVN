<template>
  <div class="mx-auto max-w-3xl px-4 py-10 lg:px-8">
    <p class="race-mono text-xs font-bold tracking-widest text-circuit-red uppercase">// Race Entry</p>
    <h1 class="mb-6 font-display text-3xl font-bold tracking-wide text-steel-white uppercase">Checkout</h1>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="h-10 w-10 animate-spin rounded-full border-2 border-track-yellow border-t-transparent"></div>
    </div>

    <div v-else-if="cartItems.length === 0" class="spec-card px-6 py-16 text-center">
      <p class="font-display text-lg font-bold uppercase">Cart Kosong</p>
      <p class="mt-1 text-sm text-asphalt/60">Tidak ada yang bisa di-checkout.</p>
      <router-link :to="{ name: 'home' }" class="btn-race mt-5 inline-flex px-5 py-2.5 text-sm">
        Belanja Dulu
      </router-link>
    </div>

    <template v-else>
      <!-- Alamat Pengiriman -->
      <div class="spec-card mb-4 p-4">
        <div class="mb-3 flex items-center justify-between">
          <h6 class="font-display text-sm font-bold tracking-wide uppercase">📍 Alamat Pengiriman</h6>
          <button type="button" class="btn-race-outline border-asphalt/30 px-3 py-1.5 text-xs text-asphalt hover:bg-asphalt hover:text-steel-white" @click="openAdd">
            + Tambah Alamat
          </button>
        </div>

        <div v-if="addresses.length === 0" class="text-sm text-asphalt/60">
          Kamu belum punya alamat tersimpan. Tambahkan dulu sebelum checkout.
        </div>

        <label
          v-for="addr in addresses"
          :key="addr.id"
          class="mb-2 flex cursor-pointer items-start gap-3 border p-3 transition-colors last:mb-0"
          :class="selectedAddressId === addr.id ? 'border-circuit-red bg-circuit-red/5' : 'border-black/10 hover:border-black/25'"
        >
          <input type="radio" class="mt-1.5 accent-circuit-red" :value="addr.id" v-model="selectedAddressId" />
          <div class="min-w-0">
            <div class="mb-1 flex flex-wrap items-center gap-2">
              <span class="corner-cut bg-asphalt px-2 py-0.5 text-[10px] font-bold tracking-wide text-steel-white uppercase">
                {{ addr.label }}
              </span>
              <span v-if="addr.isDefault" class="corner-cut bg-track-yellow px-2 py-0.5 text-[10px] font-bold tracking-wide text-asphalt uppercase">
                Utama
              </span>
            </div>
            <p class="text-sm font-bold">{{ addr.recipientName }} — {{ addr.phone }}</p>
            <p class="text-sm text-asphalt/60">
              {{ addr.fullAddress }}, {{ addr.city }}, {{ addr.province }} {{ addr.postalCode }}
            </p>
          </div>
        </label>
      </div>

      <!-- Ringkasan Pesanan: gaya tiket balap dengan tepi sobekan -->
      <div class="relative border border-black/10 bg-steel-white text-asphalt corner-cut">
        <div class="p-4">
          <h6 class="mb-3 font-display text-sm font-bold tracking-wide uppercase">🛒 Ringkasan Pesanan</h6>
          <div
            v-for="item in cartItems"
            :key="item.product.id"
            class="mb-2 flex items-center justify-between gap-2"
          >
            <div class="flex min-w-0 items-center gap-2">
              <img
                :src="`${apiBaseUrl}${item.product.imageUrl}`"
                class="h-10 w-10 shrink-0 rounded object-cover"
              />
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold">{{ item.product.name }}</p>
                <p class="race-mono text-xs text-asphalt/60">
                  {{ item.qty }} × Rp {{ item.product.price.toLocaleString() }}
                </p>
              </div>
            </div>
            <div class="race-mono shrink-0 text-sm font-bold">
              Rp {{ (item.product.price * item.qty).toLocaleString() }}
            </div>
          </div>
        </div>

        <!-- Garis sobekan tiket -->
        <div class="relative border-t-2 border-dashed border-asphalt/20">
          <span class="absolute top-1/2 -left-4 h-6 w-6 -translate-y-1/2 rounded-full bg-asphalt"></span>
          <span class="absolute top-1/2 -right-4 h-6 w-6 -translate-y-1/2 rounded-full bg-asphalt"></span>
        </div>

        <div class="flex items-center justify-between p-4">
          <span class="font-display font-bold uppercase">Total</span>
          <span class="race-mono text-xl font-bold text-circuit-red">Rp {{ totalPrice.toLocaleString() }}</span>
        </div>
      </div>
      <p class="mt-1 text-xs text-chrome/70">*Belum termasuk ongkos kirim</p>

      <p v-if="errorMessage" class="mt-3 text-sm text-circuit-red">{{ errorMessage }}</p>

      <button class="btn-race mt-4 w-full py-3.5 text-base" :disabled="!selectedAddressId || isProcessing" @click="placeOrder">
        <span v-if="isProcessing" class="h-4 w-4 animate-spin rounded-full border-2 border-asphalt border-t-transparent"></span>
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