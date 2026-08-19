<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" @click.self="close">
    <div class="spec-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-5">
      <div class="mb-1 flex items-center justify-between">
        <p class="race-mono text-xs font-bold tracking-widest text-circuit-red uppercase">// Data Pengiriman</p>
      </div>
      <h5 class="mb-4 font-display text-xl font-bold uppercase">
        {{ editing ? 'Edit Alamat' : 'Tambah Alamat Baru' }}
      </h5>

      <form @submit.prevent="submit">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label for="addr-label" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">Label Alamat</label>
            <input id="addr-label" v-model="form.label" name="label" type="text" placeholder="Rumah / Kantor" class="field-race" />
          </div>
          <div>
            <label for="addr-recipient" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">Nama Penerima</label>
            <input id="addr-recipient" v-model="form.recipientName" name="recipientName" type="text" autocomplete="name" class="field-race" required />
          </div>
          <div>
            <label for="addr-phone" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">No. HP</label>
            <input id="addr-phone" v-model="form.phone" name="phone" type="tel" autocomplete="tel" class="field-race" required />
          </div>
          <div>
            <label for="addr-postal" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">Kode Pos</label>
            <input id="addr-postal" v-model="form.postalCode" name="postalCode" type="text" autocomplete="postal-code" class="field-race" required />
          </div>
          <div>
            <label for="addr-city" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">Kota/Kabupaten</label>
            <input id="addr-city" v-model="form.city" name="city" type="text" autocomplete="address-level2" class="field-race" required />
          </div>
          <div>
            <label for="addr-province" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">Provinsi</label>
            <input id="addr-province" v-model="form.province" name="province" type="text" autocomplete="address-level1" class="field-race" required />
          </div>
          <div class="sm:col-span-2">
            <label for="addr-full" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">Alamat Lengkap</label>
            <textarea
              id="addr-full"
              v-model="form.fullAddress"
              name="fullAddress"
              autocomplete="street-address"
              rows="3"
              placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan"
              class="field resize-none"
              required
            ></textarea>
          </div>
          <label for="addr-default" class="mt-1 flex items-center gap-2 sm:col-span-2">
            <input id="addr-default" v-model="form.isDefault" name="isDefault" type="checkbox" class="h-4 w-4 accent-circuit-red" />
            <span class="text-sm font-medium">Jadikan alamat utama</span>
          </label>
        </div>

        <p v-if="errorMessage" class="mt-3 text-sm text-circuit-red">{{ errorMessage }}</p>

        <div class="mt-5 flex justify-end gap-2">
          <button type="button" class="corner-cut border border-asphalt/20 px-4 py-2 text-sm font-bold uppercase hover:bg-asphalt/5" @click="close">
            Batal
          </button>
          <button type="submit" class="btn-race px-5 py-2 text-sm" :disabled="isSaving">
            <span v-if="isSaving" class="h-4 w-4 animate-spin rounded-full border-2 border-asphalt border-t-transparent"></span>
            Simpan
          </button>
        </div>
      </form>
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