<template>
  <div class="mx-auto max-w-3xl px-4 py-10 lg:px-8">
    <div class="mb-6 flex items-end justify-between gap-3">
      <div>
        <p class="race-mono text-xs font-bold tracking-widest text-circuit-red uppercase">// Titik Pengiriman</p>
        <h1 class="font-display text-3xl font-bold tracking-wide text-steel-white uppercase">Alamat Saya</h1>
      </div>
      <button type="button" class="btn-race px-4 py-2 text-sm" @click="openAdd">+ Tambah</button>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <div class="h-10 w-10 animate-spin rounded-full border-2 border-track-yellow border-t-transparent"></div>
    </div>

    <div v-else-if="addresses.length === 0" class="spec-card px-6 py-16 text-center">
      <p class="font-display text-lg font-bold uppercase">Belum Ada Alamat</p>
      <p class="mt-1 text-sm text-asphalt/60">Tambahkan alamat pengiriman pertamamu.</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="addr in addresses" :key="addr.id" class="spec-card p-4">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="mb-1 flex flex-wrap items-center gap-2">
              <span class="corner-cut bg-asphalt px-2 py-0.5 text-[10px] font-bold tracking-wide text-steel-white uppercase">
                {{ addr.label }}
              </span>
              <span
                v-if="addr.isDefault"
                class="corner-cut bg-track-yellow px-2 py-0.5 text-[10px] font-bold tracking-wide text-asphalt uppercase"
              >
                Utama
              </span>
            </div>
            <p class="font-display font-bold">{{ addr.recipientName }} — {{ addr.phone }}</p>
            <p class="text-sm text-asphalt/60">
              {{ addr.fullAddress }}, {{ addr.city }}, {{ addr.province }} {{ addr.postalCode }}
            </p>
          </div>

          <div class="flex shrink-0 flex-col gap-2" style="min-width: 140px">
            <button
              type="button"
              class="corner-cut border-2 border-asphalt/20 px-3 py-1.5 text-xs font-bold tracking-wide uppercase hover:border-asphalt"
              @click="openEdit(addr)"
            >
              Edit
            </button>
            <button
              v-if="!addr.isDefault"
              type="button"
              class="corner-cut border-2 border-turbo-cyan px-3 py-1.5 text-xs font-bold tracking-wide text-turbo-cyan uppercase hover:bg-turbo-cyan hover:text-asphalt"
              @click="setDefault(addr.id)"
            >
              Jadikan Utama
            </button>
            <button
              type="button"
              class="corner-cut border-2 border-circuit-red px-3 py-1.5 text-xs font-bold tracking-wide text-circuit-red uppercase hover:bg-circuit-red hover:text-steel-white"
              @click="remove(addr.id)"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <AddressFormModal v-model="showModal" :editing="editingAddress" @saved="onSaved" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useAddressStore, type Address } from '@/stores/address'
import AddressFormModal from '@/components/AddressFormModal.vue'

const addressStore = useAddressStore()
const addresses = computed(() => addressStore.addresses)

const loading = ref(true)
const showModal = ref(false)
const editingAddress = ref<Address | null>(null)

const openAdd = () => {
  editingAddress.value = null
  showModal.value = true
}

const openEdit = (addr: Address) => {
  editingAddress.value = addr
  showModal.value = true
}

const onSaved = () => {
  editingAddress.value = null
}

const setDefault = async (id: string) => {
  await addressStore.setDefault(id)
}

const remove = async (id: string) => {
  if (!confirm('Hapus alamat ini?')) return
  await addressStore.deleteAddress(id)
}

onMounted(async () => {
  loading.value = true
  await addressStore.fetchAddresses()
  loading.value = false
})
</script>