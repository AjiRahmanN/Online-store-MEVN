import { defineStore } from 'pinia'
import { useApi, useApiPrivate } from '../composables/useApi.ts'

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  fullName: string
  roles: string[]
}

export interface State {
  user: User | null
  accessToken: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  first_name: string
  last_name: string
  password: string
  password_confirm: string
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    user: null,
    accessToken: '',
  }),

  getters: {
    userDetail: (state) => state.user,
    isAuthenticated: (state) => !!state.user?.id,
  },

  actions: {
    async attempt(): Promise<void> {
      try {
        await this.refreshToken()
        await this.getUser()
      } catch {
        return
      }
    },

    async login(payload: LoginData): Promise<any> {
      try {
        const { data } = await useApi().post('/api/auth/login', payload)
        this.accessToken = data?.access_token
        await this.getUser()
        return data
      } catch (error: any) {
        throw error?.response?.data?.message || error.message
      }
    },

    async logout(): Promise<any> {
      try {
        const { data } = await useApiPrivate().post('/api/auth/logout')
        this.accessToken = ''
        this.user = null
        return data
      } catch (error: any) {
        throw error?.response?.data?.message || error.message
      }
    },

    async register(payload: RegisterData): Promise<any> {
      try {
        const { data } = await useApi().post('/api/auth/register', payload)
        return data
      } catch (error: any) {
        throw error?.response?.data?.message || error.message
      }
    },

    async getUser(): Promise<any> {
      try {
        const { data } = await useApiPrivate().get('/api/auth/user')
        this.user = data
        return data
      } catch (error: any) {
        throw error?.response?.data?.message || error.message
      }
    },

    async refreshToken(): Promise<any> {
      try {
        const { data } = await useApi().post('/api/auth/refresh')
        this.accessToken = data?.access_token
        return data
      } catch (error: any) {
        throw error?.response?.data?.message || error.message
      }
    },
  },

  persist: true,
})
