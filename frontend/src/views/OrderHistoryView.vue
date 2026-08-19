<template>
  <div class="mx-auto max-w-3xl px-4 py-10 lg:px-8">
    <p class="race-mono text-xs font-bold tracking-widest text-circuit-red uppercase">// Riwayat Balapan</p>
    <h1 class="mb-6 font-display text-3xl font-bold tracking-wide text-steel-white uppercase">Pesanan Saya</h1>

    <div v-if="successOrderId" class="mb-4 border-l-4 border-turbo-cyan bg-turbo-cyan/10 px-4 py-3 text-sm text-turbo-cyan">
      Pesanan <strong class="race-mono">{{ successOrderId }}</strong> berhasil dibuat. Status akan diperbarui otomatis
      setelah pembayaran dikonfirmasi.
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <div class="h-10 w-10 animate-spin rounded-full border-2 border-track-yellow border-t-transparent"></div>
    </div>

    <div v-else-if="orders.length === 0" class="spec-card px-6 py-16 text-center">
      <p class="font-display text-lg font-bold uppercase">Belum Ada Pesanan</p>
      <p class="mt-1 text-sm text-asphalt/60">Yuk cari part buat mesin balapmu.</p>
      <router-link :to="{ name: 'home' }" class="btn-race mt-5 inline-flex px-5 py-2.5 text-sm">
        Ke Katalog
      </router-link>
    </div>

    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order.id" class="spec-card p-4">
        <div class="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p class="race-mono text-sm font-bold">{{ order.orderId }}</p>
            <p class="text-xs text-asphalt/50">{{ formatDate(order.createdAt) }}</p>
          </div>
          <span
            class="corner-cut px-2.5 py-1 font-display text-xs font-bold tracking-wide uppercase"
            :class="statusBadgeClass(order.status)"
          >
            {{ statusLabel(order.status) }}
          </span>
        </div>

        <div v-if="order.shippingAddress" class="mt-3 border-t border-black/10 pt-3">
          <p class="mb-1 text-xs font-bold tracking-wide text-asphalt/50 uppercase">Dikirim ke</p>
          <p class="text-sm">
            <strong>{{ order.shippingAddress.recipientName }}</strong> — {{ order.shippingAddress.phone }}<br />
            <span class="text-asphalt/70">
              {{ order.shippingAddress.fullAddress }}, {{ order.shippingAddress.city }},
              {{ order.shippingAddress.province }} {{ order.shippingAddress.postalCode }}
            </span>
          </p>
        </div>

        <div class="mt-3 space-y-1 border-t border-black/10 pt-3">
          <div v-for="item in order.items" :key="item.product" class="flex justify-between text-sm">
            <span>{{ item.name }} × {{ item.qty }}</span>
            <span class="race-mono">Rp {{ (item.price * item.qty).toLocaleString() }}</span>
          </div>
        </div>

        <div class="mt-3 flex justify-between border-t border-black/10 pt-3 font-display font-bold uppercase">
          <span>Total</span>
          <span class="race-mono text-circuit-red">Rp {{ order.totalAmount.toLocaleString() }}</span>
        </div>

        <div v-if="order.status === 'pending'" class="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            class="corner-cut border-2 border-asphalt/20 px-3 py-1.5 text-xs font-bold tracking-wide uppercase hover:border-asphalt disabled:opacity-40"
            :disabled="processingOrderId === order.orderId"
            @click="refreshStatus(order.orderId)"
          >
            Cek Status Pembayaran
          </button>
          <button
            type="button"
            class="corner-cut border-2 border-circuit-red px-3 py-1.5 text-xs font-bold tracking-wide text-circuit-red uppercase hover:bg-circuit-red hover:text-steel-white disabled:opacity-40"
            :disabled="processingOrderId === order.orderId"
            @click="cancelOrder(order.orderId)"
          >
            <span v-if="processingOrderId === order.orderId" class="mr-1 inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
            Batalkan Pesanan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderStore } from '@/stores/order'

const orderStore = useOrderStore()
const route = useRoute()

const loading = ref(true)
const orders = computed(() => orderStore.orders)
const successOrderId = computed(() => route.query.success as string | undefined)
const processingOrderId = ref<string | null>(null)

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: 'Menunggu Pembayaran',
    paid: 'Sudah Dibayar',
    failed: 'Gagal',
    expired: 'Kedaluwarsa',
    cancelled: 'Dibatalkan',
  }
  return map[status] || status
}

const statusBadgeClass = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-track-yellow text-asphalt',
    paid: 'bg-turbo-cyan text-asphalt',
    failed: 'bg-circuit-red text-steel-white',
    expired: 'bg-chrome text-asphalt',
    cancelled: 'bg-chrome text-asphalt',
  }
  return map[status] || 'bg-chrome text-asphalt'
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })

const refreshStatus = async (orderId: string) => {
  processingOrderId.value = orderId
  try {
    await orderStore.verifyOrder(orderId)
    await orderStore.fetchMyOrders()
  } finally {
    processingOrderId.value = null
  }
}

const cancelOrder = async (orderId: string) => {
  if (!confirm('Yakin mau batalkan pesanan ini?')) return

  processingOrderId.value = orderId
  try {
    await orderStore.cancelOrder(orderId)
    await orderStore.fetchMyOrders()
  } catch (err: any) {
    alert(typeof err === 'string' ? err : 'Gagal membatalkan pesanan.')
  } finally {
    processingOrderId.value = null
  }
}

onMounted(async () => {
  loading.value = true
  await orderStore.fetchMyOrders()
  loading.value = false
})
</script>