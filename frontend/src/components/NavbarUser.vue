<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <!-- Brand -->
      <router-link to="/" class="navbar-brand">MyApp</router-link>

      <!-- Toggle button -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar content -->
      <div class="collapse navbar-collapse" id="navbarSupportedContent">

        <!-- Left side -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link :to="{ name: 'home' }" class="nav-link">Home</router-link>
          </li>
          <!-- Search form -->
          <form class="d-flex me-3" role="search">
            <input 
              class="form-control me-2" 
              type="search" 
              placeholder="Search" 
              aria-label="Search"
            />
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
        </ul>


        <!-- Right side (auth links) -->
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <!-- Jika user sudah login -->
          <li v-if="isAuthenticated" class="nav-item dropdown position-relative">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              🛒
              <span v-if="cartItems.length" class="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">
                {{ cartItems.length }}
              </span>
            </a>

            <ul class="dropdown-menu dropdown-menu-end" style="min-width: 300px;">
              <li v-if="cartItems.length === 0" class="dropdown-item text-muted">
                Cart kosong
              </li>
              <li
                v-for="item in cartItems"
                :key="item._id"
                class="dropdown-item d-flex align-items-center"
              >
                <img
                  :src="`http://localhost:3500${item.imageUrl}`"
                  alt=""
                  width="40"
                  height="40"
                  class="me-2 rounded"
                />
                <div>
                  <span class="d-block fw-bold">{{ item.name }}</span>
                  <small class="text-muted">Rp {{ item.price?.toLocaleString() }}</small>
                </div>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <router-link :to="{ name: 'cart' }" class="dropdown-item text-center text-primary">
                  Lihat Keranjang
                </router-link>
              </li>
            </ul>
          </li>
          <li v-if="isAuthenticated" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ user?.username }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <router-link :to="{ name: 'user' }" class="dropdown-item">User Profile</router-link>
              </li>
              <li><a class="dropdown-item" href="#">Settings</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><button @click="logout" class="dropdown-item text-danger">Logout</button></li>
            </ul>
          </li>

          <!-- Jika belum login -->
          <template v-else>
            <li class="nav-item">
              <router-link :to="{ name: 'login' }" class="nav-link">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'register' }" class="nav-link">Register</router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'
import { onMounted, computed } from 'vue'

const router = useRouter()
const authStore = useAuthStore() as any
const cartStore = useCartStore() as any

const user = computed(() => authStore.user)
const isAuthenticated = computed(() => authStore.isAuthenticated)

// ambil cartItems dari store
const cartItems = computed(() => cartStore.items)


// ambil data saat halaman dimuat
onMounted(() => {
  cartStore.fetchCart()
})

async function logout() {
  try {
    await authStore.logout()
    router.replace({ name: 'login' })
  } catch (error: any) {
    console.error(error)
    alert(error?.response?.data?.message || 'Unknown error')
  }
}
</script>
