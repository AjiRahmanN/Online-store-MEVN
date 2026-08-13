<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-0">📍 Alamat Saya</h2>
      <button class="btn btn-success" @click="openAdd">+ Tambah Alamat</button>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="addresses.length === 0" class="alert alert-info text-center">
      Kamu belum punya alamat tersimpan.
    </div>

    <div v-else>
      <div v-for="addr in addresses" :key="addr.id" class="card mb-3 shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between flex-wrap gap-3">
            <div>
              <span class="badge bg-secondary me-2">{{ addr.label }}</span>
              <span v-if="addr.isDefault" class="badge bg-success">Utama</span>
              <h6 class="mt-2 mb-1">{{ addr.recipientName }} — {{ addr.phone }}</h6>
              <p class="mb-0 text-muted">
                {{ addr.fullAddress }}, {{ addr.city }}, {{ addr.province }} {{ addr.postalCode }}
              </p>
            </div>
            <div class="d-flex flex-column gap-2" style="min-width: 140px">
              <button class="btn btn-outline-primary btn-sm" @click="openEdit(addr)">Edit</button>
              <button
                v-if="!addr.isDefault"
                class="btn btn-outline-success btn-sm"
                @click="setDefault(addr.id)"
              >
                Jadikan Utama
              </button>
              <button class="btn btn-outline-danger btn-sm" @click="remove(addr.id)">Hapus</button>
            </div>
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
