import { defineStore } from 'pinia'
import { useApiPrivate } from '@/composables/useApi'

export interface Address {
  id: string
  label: string
  recipientName: string
  phone: string
  fullAddress: string
  city: string
  province: string
  postalCode: string
  isDefault: boolean
}

export type AddressPayload = {
  label: string
  recipientName: string
  phone: string
  fullAddress: string
  city: string
  province: string
  postalCode: string
  isDefault?: boolean
}

export const useAddressStore = defineStore('address', {
  state: () => ({
    addresses: [] as Address[],
  }),
  getters: {
    defaultAddress: (state) => state.addresses.find((a) => a.isDefault) || state.addresses[0] || null,
  },
  actions: {
    async fetchAddresses() {
      try {
        const { data } = await useApiPrivate().get('/api/addresses')
        this.addresses = data
      } catch (error: any) {
        console.error('Error fetching addresses:', error)
        throw error.response?.data?.message || error.message
      }
    },

    async addAddress(payload: AddressPayload) {
      try {
        const { data } = await useApiPrivate().post('/api/addresses', payload)
        await this.fetchAddresses()
        return data
      } catch (error: any) {
        throw error.response?.data?.message || error.message
      }
    },

    async updateAddress(id: string, payload: AddressPayload) {
      try {
        const { data } = await useApiPrivate().patch(`/api/addresses/${id}`, payload)
        await this.fetchAddresses()
        return data
      } catch (error: any) {
        throw error.response?.data?.message || error.message
      }
    },

    async deleteAddress(id: string) {
      try {
        await useApiPrivate().delete(`/api/addresses/${id}`)
        await this.fetchAddresses()
      } catch (error: any) {
        throw error.response?.data?.message || error.message
      }
    },

    async setDefault(id: string) {
      try {
        await useApiPrivate().patch(`/api/addresses/${id}/default`)
        await this.fetchAddresses()
      } catch (error: any) {
        throw error.response?.data?.message || error.message
      }
    },
  },
})
