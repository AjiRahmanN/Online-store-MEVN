<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar scroll</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarScroll">
      <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">
        <li class="nav-item">
          <router-link class="nav-link active" aria-current="page" :to="{name:'adminproducts'}">List Product</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link active" aria-current="page" to="">List User</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link active" aria-current="page" :to="{name:'TambahProduct'}">Add Product</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link active" aria-current="page" to="">Add User</router-link>
        </li>
        <li v-if="isAuthenticated" class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            {{ user?.username }}
          </a>
          <ul class="dropdown-menu">
            <li><router-link :to="{ name: 'user' }" class="nav-link dropdown-item">User Profile</router-link></li>
            <li><a class="dropdown-item" href="#">Setings</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><button @click="logout" class="dropdown-item btn btn-danger">Logout</button></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script setup lang="ts">
import { useAuthStore} from '../stores/auth';
import { useRouter } from 'vue-router';
import { computed} from 'vue'
const router = useRouter()

const authStore = useAuthStore() as any

const user = computed(() =>{
  return authStore.user
}) 

const isAuthenticated = computed(() =>{
  return authStore.isAuthenticated
}) 

async function logout() {
  await authStore.logout()
  .then((res: unknown) => {
    console.log('Logged out successfully')
    router.replace({ name: 'login' })
  })
  .catch((error: unknown) => {
    if (error && typeof error === 'object' && 'response' in error) {
    throw (error as any)?.response?.data?.message || 'Unknown error'
  }
  throw 'Unknown error'
  })
}
</script>


<style scoped>  </style>
