<template>
  <div class="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden bg-asphalt px-4 py-12">
    <!-- Garis kecepatan dekoratif -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.06]"
      style="background-image: repeating-linear-gradient(100deg, #edeff2 0 2px, transparent 2px 60px)"
    ></div>

    <div class="spec-card relative w-full max-w-md p-6">
      <p class="race-mono text-xs font-bold tracking-widest text-circuit-red uppercase">// Daftar Pembalap Baru</p>
      <h1 class="mb-6 font-display text-2xl font-bold tracking-wide uppercase">Buat Akun</h1>

      <form @submit.prevent="submit" class="space-y-4">
        <p v-if="errorMessage" class="border-l-4 border-circuit-red bg-circuit-red/10 px-3 py-2 text-sm text-circuit-red">
          {{ errorMessage }}
        </p>

        <div>
          <label for="username" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">
            Username
          </label>
          <input id="username" v-model="registerData.username" name="username" type="text" autocomplete="username" class="field-race" required />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="first_name" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">
              Nama Depan
            </label>
            <input id="first_name" v-model="registerData.first_name" name="first_name" type="text" autocomplete="given-name" class="field-race" />
          </div>
          <div>
            <label for="last_name" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">
              Nama Belakang
            </label>
            <input id="last_name" v-model="registerData.last_name" name="last_name" type="text" autocomplete="family-name" class="field-race" />
          </div>
        </div>

        <div>
          <label for="email" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">
            Email
          </label>
          <input id="email" v-model="registerData.email" name="email" type="email" autocomplete="email" class="field-race" required />
        </div>

        <div>
          <label for="password" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">
            Password
          </label>
          <input id="password" v-model="registerData.password" name="password" type="password" autocomplete="new-password" class="field-race" required />
        </div>

        <div>
          <label for="passwordconfirm" class="mb-1 block text-xs font-bold tracking-wide text-asphalt/60 uppercase">
            Konfirmasi Password
          </label>
          <input
            id="passwordconfirm"
            v-model="registerData.password_confirm"
            name="password_confirm"
            type="password"
            autocomplete="new-password"
            class="field-race"
            required
          />
        </div>

        <button type="submit" class="btn-race w-full py-3 text-sm" :disabled="isSubmitting">
          <span
            v-if="isSubmitting"
            class="h-4 w-4 animate-spin rounded-full border-2 border-asphalt border-t-transparent"
          ></span>
          Daftar
        </button>
      </form>

      <p class="mt-5 text-center text-sm text-asphalt/60">
        Sudah punya akun?
        <router-link :to="{ name: 'login' }" class="font-bold text-circuit-red hover:underline">
          Masuk di sini
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore, type RegisterData } from '../../stores/auth'
import { reactive, ref } from 'vue'

const authStore = useAuthStore() as any
const router = useRouter()

const registerData = reactive<RegisterData>({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirm: '',
})

const errorMessage = ref<string>('')
const isSubmitting = ref(false)

async function submit() {
  errorMessage.value = ''

  if (registerData.password !== registerData.password_confirm) {
    errorMessage.value = 'Password dan konfirmasi password tidak sama'
    return
  }

  isSubmitting.value = true
  try {
    await authStore.register(registerData)
    router.replace({ name: 'login' })
  } catch (error: unknown) {
    // authStore.register() sudah melempar STRING pesan error (bukan objek axios)
    errorMessage.value = typeof error === 'string' ? error : 'Terjadi kesalahan, coba lagi.'
  } finally {
    isSubmitting.value = false
  }
}
</script>