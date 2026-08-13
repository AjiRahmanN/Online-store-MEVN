<template>
  <div class="container mt-4">
    <h2 class="mb-3">📦 Pesanan Saya</h2>

    <div v-if="successOrderId" class="alert alert-success">
      Pesanan <strong>{{ successOrderId }}</strong> berhasil dibuat. Status akan diperbarui otomatis setelah pembayaran dikonfirmasi.
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="orders.length === 0" class="alert alert-info text-center">
      Kamu belum punya pesanan.
    </div>

    <div v-else>
      <div v-for="order in orders" :key="order.id" class="card mb-3 shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h6 class="mb-1">{{ order.orderId }}</h6>
              <small class="text-muted">{{ formatDate(order.createdAt) }}</small>
            </div>
            <span class="badge" :class="statusBadgeClass(order.status)">
              {{ statusLabel(order.status) }}
            </span>
          </div>

          <hr />

          <div v-if="order.shippingAddress" class="mb-2">
            <small class="text-muted d-block mb-1">Dikirim ke:</small>
            <div class="small">
              <strong>{{ order.shippingAddress.recipientName }}</strong> — {{ order.shippingAddress.phone }}<br />
              {{ order.shippingAddress.fullAddress }}, {{ order.shippingAddress.city }},
              {{ order.shippingAddress.province }} {{ order.shippingAddress.postalCode }}
            </div>
          </div>

          <hr />

          <div v-for="item in order.items" :key="item.product" class="d-flex justify-content-between mb-1">
            <span>{{ item.name }} × {{ item.qty }}</span>
            <span>Rp {{ (item.price * item.qty).toLocaleString() }}</span>
          </div>

          <hr />

          <div class="d-flex justify-content-between fw-bold">
            <span>Total</span>
            <span>Rp {{ order.totalAmount.toLocaleString() }}</span>
          </div>

          <div v-if="order.status === 'pending'" class="d-flex gap-2 mt-3">
            <button
              class="btn btn-outline-primary btn-sm"
              :disabled="processingOrderId === order.orderId"
              @click="refreshStatus(order.orderId)"
            >
              Cek Status Pembayaran
            </button>
            <button
              class="btn btn-outline-danger btn-sm"
              :disabled="processingOrderId === order.orderId"
              @click="cancelOrder(order.orderId)"
            >
              <span v-if="processingOrderId === order.orderId" class="spinner-border spinner-border-sm me-1"></span>
              Batalkan Pesanan
            </button>
          </div>
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
    pending: 'bg-warning text-dark',
    paid: 'bg-success',
    failed: 'bg-danger',
    expired: 'bg-secondary',
    cancelled: 'bg-secondary',
  }
  return map[status] || 'bg-secondary'
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