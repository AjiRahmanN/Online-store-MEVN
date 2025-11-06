<template>
  <h1>Login Page</h1>
  <div id="login" class="container">
    <div class="card card-body">
      <h5 class="card-title">Login</h5>
      <form @submit.prevent="submit">
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
        <button type="submit" class="btn btn-success">login</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore, type LoginData } from '../../stores/auth';
import { reactive, ref } from 'vue'

const authStore = useAuthStore() as any
const router = useRouter()

const loginData = reactive<LoginData>({
  email: '',
  password: ''
})

const errorMessage = ref<string>('')

async function submit() {
  await authStore.login(loginData)// Gunakan authStore yang sudah dideklarasikan
  .then((res: unknown) => {
    router.replace({ name: 'user' })
    console.log(res)
  })
  .catch((error: unknown) => {
    if (error && typeof error === 'object' && 'response' in error) {
    throw (error as any)?.response?.data?.message || 'Unknown error'
  }
  throw 'Unknown error'
  })
}
</script>
<style scoped>
#login .card {
  max-width: 40vw;
  margin: auto;
}
</style>