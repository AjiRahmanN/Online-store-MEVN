<template>
  <div v-if="modelValue" class="address-modal-backdrop" @click.self="close">
    <div class="address-modal-content card shadow">
      <div class="card-body">
        <h5 class="mb-3">{{ editing ? 'Edit Alamat' : 'Tambah Alamat Baru' }}</h5>
        <form @submit.prevent="submit">
          <div class="row g-2">
            <div class="col-md-6">
              <label class="form-label">Label Alamat</label>
              <input v-model="form.label" type="text" class="form-control" placeholder="Rumah / Kantor" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Nama Penerima</label>
              <input v-model="form.recipientName" type="text" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">No. HP</label>
              <input v-model="form.phone" type="tel" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Kode Pos</label>
              <input v-model="form.postalCode" type="text" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Kota/Kabupaten</label>
              <input v-model="form.city" type="text" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Provinsi</label>
              <input v-model="form.province" type="text" class="form-control" required />
            </div>
            <div class="col-12">
              <label class="form-label">Alamat Lengkap</label>
              <textarea
                v-model="form.fullAddress"
                class="form-control"
                rows="3"
                placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan"
                required
              ></textarea>
            </div>
            <div class="col-12 form-check mt-2">
              <input v-model="form.isDefault" type="checkbox" class="form-check-input" id="isDefaultCheck" />
              <label class="form-check-label" for="isDefaultCheck">Jadikan alamat utama</label>
            </div>
          </div>

          <p v-if="errorMessage" class="text-danger mt-3 mb-0">{{ errorMessage }}</p>

          <div class="d-flex justify-content-end gap-2 mt-4">
            <button type="button" class="btn btn-outline-secondary" @click="close">Batal</button>
            <button type="submit" class="btn btn-success" :disabled="isSaving">
              <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useAddressStore, type Address, type AddressPayload } from '@/stores/address'

const props = defineProps<{
  modelValue: boolean
  editing?: Address | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}>()

const addressStore = useAddressStore()

const emptyForm = (): AddressPayload => ({
  label: 'Rumah',
  recipientName: '',
  phone: '',
  fullAddress: '',
  city: '',
  province: '',
  postalCode: '',
  isDefault: false,
})

const form = reactive<AddressPayload>(emptyForm())
const errorMessage = ref('')
const isSaving = ref(false)

watch(
  () => [props.modelValue, props.editing],
  () => {
    errorMessage.value = ''
    if (props.editing) {
      Object.assign(form, {
        label: props.editing.label,
        recipientName: props.editing.recipientName,
        phone: props.editing.phone,
        fullAddress: props.editing.fullAddress,
        city: props.editing.city,
        province: props.editing.province,
        postalCode: props.editing.postalCode,
        isDefault: props.editing.isDefault,
      })
    } else {
      Object.assign(form, emptyForm())
    }
  },
  { immediate: true },
)

const close = () => emit('update:modelValue', false)

const submit = async () => {
  errorMessage.value = ''
  isSaving.value = true
  try {
    if (props.editing) {
      await addressStore.updateAddress(props.editing.id, form)
    } else {
      await addressStore.addAddress(form)
    }
    emit('saved')
    close()
  } catch (err: any) {
    errorMessage.value = typeof err === 'string' ? err : 'Gagal menyimpan alamat.'
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.address-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.address-modal-content {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}
</style>
