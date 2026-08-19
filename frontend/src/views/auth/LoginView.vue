<template>
  <div class="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden bg-asphalt px-4 py-12">
    <!-- Garis kecepatan dekoratif -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.06]"
      style="background-image: repeating-linear-gradient(100deg, #edeff2 0 2px, transparent 2px 60px)"
    ></div>

    <div class="spec-card relative w-full max-w-sm p-6">
      <p class="race-mono text-xs font-bold tracking-widest text-circuit-red uppercase">// Pit Access</p>
      <h1 class="mb-6 font-display text-2xl font-bold tracking-wide uppercase">Masuk Akun</h1>

      <form @submit.prevent="submit" class="space-y-4">
        <p v-if="errorMessage" class="border-l-4 border-circuit-red bg-circuit-red/10 px-3 py-2 text-sm text-circuit-red">
          {{ errorMessage }}
        </p>

        <div>
          <label for="email" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">
            Email
          </label>
          <input
            id="email"
            v-model="loginData.email"
            name="email"
            type="email"
            autocomplete="email"
            class="field-race"
            required
          />
        </div>

        <div>
          <label for="password" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">
            Password
          </label>
          <input
            id="password"
            v-model="loginData.password"
            name="password"
            type="password"
            autocomplete="current-password"
            class="field-race"
            required
          />
        </div>

        <button type="submit" class="btn-race w-full py-3 text-sm" :disabled="isSubmitting">
          <span
            v-if="isSubmitting"
            class="h-4 w-4 animate-spin rounded-full border-2 border-asphalt border-t-transparent"
          ></span>
          Masuk
        </button>
      </form>

      <p class="mt-5 text-center text-sm text-asphalt/60">
        Belum punya akun?
        <router-link :to="{ name: 'register' }" class="font-bold text-circuit-red hover:underline">
          Daftar di sini
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore, type LoginData } from '../../stores/auth'
import { reactive, ref } from 'vue'

const authStore = useAuthStore() as any
const router = useRouter()
const route = useRoute()

const loginData = reactive<LoginData>({
  email: '',
  password: '',
})

const errorMessage = ref<string>('')
const isSubmitting = ref(false)

async function submit() {
  errorMessage.value = ''
  isSubmitting.value = true
  try {
    await authStore.login(loginData)
    // Kalau sebelumnya diarahkan ke /login karena akses halaman terproteksi
    // (lihat router.beforeEach di router/index.ts), balik ke halaman itu lagi.
    const redirect = (route.query.redirect as string) || undefined
    router.replace(redirect ? redirect : { name: 'user' })
  } catch (error: unknown) {
    // authStore.login() sudah melempar STRING pesan error (bukan objek axios)
    errorMessage.value = typeof error === 'string' ? error : 'Email atau password salah.'
  } finally {
    isSubmitting.value = false
  }
}
</script>