<template>

  <div id="register" class="container">
    <h5 class="card-title">Register</h5>
    <div class="card card-body mt-4">
      <form @submit.prevent="submit">
        <p v-if="errorMessage" class="error-message text-danger mb-4">{{ errorMessage }}</p>
        <div class="mb-3 mt-4">
          <label for="username" class="form-label">Username</label>
          <input v-model="registerData.username" type="text" class="form-control" id="username" aria-describedby="emailHelp">
          <!-- <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> -->
        </div>
        <div class="mb-3 mt-4">
          <label for="first_name" class="form-label">First Name</label>
          <input v-model="registerData.first_name" type="text" class="form-control" id="first_name" aria-describedby="emailHelp">
          <!-- <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> -->
        </div>
        <div class="mb-3 mt-4">
          <label for="last_name" class="form-label">Last Name</label>
          <input v-model="registerData.last_name" type="text" class="form-control" id="last_name" aria-describedby="emailHelp">
          <!-- <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> -->
        </div>
        <div class="mb-3 mt-4">
          <label for="email" class="form-label">Email address</label>
          <input v-model="registerData.email" type="email" class="form-control" id="email" aria-describedby="emailHelp">
          <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input v-model="registerData.password" type="password" class="form-control" id="password">
        </div>
        <div class="mb-3">
          <label for="passwordconfirm" class="form-label">Confirm Your Password</label>
          <input v-model="registerData.password_confirm" type="password" class="form-control" id="passwordconfirm">
        </div>
        <!-- <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="exampleCheck1">
          <label class="form-check-label" for="exampleCheck1">Check me out</label>
        </div> -->
        <button type="submit" class="btn btn-success" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
          Register
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore, type RegisterData } from '../../stores/auth';
import { reactive, ref } from 'vue'

const authStore = useAuthStore() as any
const router = useRouter()


const registerData = reactive<RegisterData>({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirm: ''
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
    // authStore.register() sudah melempar STRING pesan error (bukan objek axios),
    // jadi cukup ditampilkan langsung -- tidak perlu cek 'response' in error lagi.
    errorMessage.value = typeof error === 'string' ? error : 'Terjadi kesalahan, coba lagi.'
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