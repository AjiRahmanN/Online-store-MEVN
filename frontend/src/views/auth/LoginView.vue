<template>
  <h1>Login Page</h1>
  <div id="login" class="container">
    <div class="card card-body">
      <h5 class="card-title">Login</h5>
      <form @submit.prevent="submit">
        <p v-if="errorMessage" class="error-message text-danger mb-4">{{ errorMessage }}</p>
        <div class="mb-3 mt-4">
          <label for="email" class="form-label">Email address</label>
          <input v-model="loginData.email" type="email" class="form-control" id="email" aria-describedby="emailHelp">
          <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input v-model="loginData.password" type="password" class="form-control" id="password">
        </div>
        <!-- <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="exampleCheck1">
          <label class="form-check-label" for="exampleCheck1">Check me out</label>
        </div> -->
        <button type="submit" class="btn btn-success" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
          login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore, type LoginData } from '../../stores/auth';
import { reactive, ref } from 'vue'

const authStore = useAuthStore() as any
const router = useRouter()
const route = useRoute()

const loginData = reactive<LoginData>({
  email: '',
  password: ''
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
<style scoped>
#login .card {
  max-width: 40vw;
  margin: auto;
}
</style>