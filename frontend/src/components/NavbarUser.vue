<template>
  <header class="sticky top-0 z-40 bg-asphalt">
    <nav class="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
      <!-- Logo -->
      <router-link :to="{ name: 'home' }" class="flex shrink-0 items-center gap-2.5">
        <span
          class="corner-cut flex h-10 w-10 items-center justify-center bg-track-yellow font-display text-lg font-bold text-asphalt"
        >
          M4
        </span>
        <span class="font-display text-xl leading-none font-bold tracking-wide text-steel-white uppercase">
          Mendo<span class="text-circuit-red">Racing</span>
        </span>
      </router-link>

      <!-- Search (desktop) -->
      <form class="mx-2 hidden max-w-md flex-1 items-center lg:flex" role="search" @submit.prevent>
        <div class="relative w-full">
          <input
            id="navbar-search"
            name="search"
            type="search"
            autocomplete="off"
            placeholder="Cari sparepart, motor, ban..."
            class="w-full border border-white/10 bg-asphalt-light px-4 py-2 pr-10 text-sm text-steel-white placeholder-chrome/50 corner-cut focus:border-track-yellow focus:outline-none"
          />
          <svg
            class="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-chrome/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 114 10.5a6.5 6.5 0 0113 0z"
            />
          </svg>
        </div>
      </form>

      <div class="ml-auto flex items-center gap-2">
        <router-link
          :to="{ name: 'home' }"
          class="hidden px-2 font-display text-sm font-semibold tracking-wide text-chrome uppercase hover:text-track-yellow lg:inline-block"
        >
          Katalog
        </router-link>

        <!-- Sudah login -->
        <template v-if="isAuthenticated">
          <!-- Cart -->
          <div class="relative" ref="cartWrapperRef">
            <button
              type="button"
              class="relative flex h-10 w-10 items-center justify-center corner-cut border border-white/10 bg-asphalt-light text-steel-white hover:border-track-yellow"
              @click="toggleCart"
              aria-label="Keranjang"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l3.6-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 005.6 19H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4"
                />
              </svg>
              <span
                v-if="totalItems"
                class="race-mono absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-circuit-red px-1 text-[11px] font-bold text-steel-white"
              >
                {{ totalItems }}
              </span>
            </button>

            <div v-if="showCart" class="spec-card absolute right-0 z-20 mt-2 w-80 p-3">
              <p class="mb-2 font-display text-xs font-bold tracking-widest text-asphalt/60 uppercase">
                Keranjang
              </p>
              <p v-if="cartItems.length === 0" class="py-4 text-center text-sm text-asphalt/60">
                Masih kosong. Yuk cari part!
              </p>
              <div v-else class="max-h-64 space-y-2 overflow-y-auto pr-1">
                <div
                  v-for="item in cartItems"
                  :key="item.product.id"
                  class="flex items-center gap-2 border-b border-black/10 pb-2 last:border-0"
                >
                  <img
                    :src="`${apiBaseUrl}${item.product.imageUrl}`"
                    class="h-10 w-10 shrink-0 rounded object-cover"
                    alt=""
                  />
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-semibold">{{ item.product.name }} × {{ item.qty }}</p>
                    <p class="race-mono text-xs text-asphalt/60">
                      Rp {{ item.product.price?.toLocaleString() }}
                    </p>
                  </div>
                </div>
              </div>
              <router-link
                :to="{ name: 'cart' }"
                class="btn-race mt-3 block w-full text-center text-sm"
                @click="showCart = false"
              >
                Lihat Keranjang
              </router-link>
            </div>
          </div>

          <!-- User menu -->
          <div class="relative" ref="userWrapperRef">
            <button
              type="button"
              class="flex h-10 items-center gap-2 corner-cut border border-white/10 bg-asphalt-light px-3 text-sm font-semibold text-steel-white hover:border-track-yellow"
              @click="toggleUser"
            >
              <span class="flex h-6 w-6 items-center justify-center rounded-full bg-track-yellow text-xs font-bold text-asphalt">
                {{ initials }}
              </span>
              <span class="hidden max-w-24 truncate lg:inline">{{ user?.username }}</span>
            </button>

            <div v-if="showUser" class="spec-card absolute right-0 z-20 mt-2 w-52 py-1">
              <router-link
                :to="{ name: 'user' }"
                class="block px-4 py-2 text-sm font-medium hover:bg-track-yellow"
                @click="showUser = false"
              >
                Profil Saya
              </router-link>
              <router-link
                :to="{ name: 'order-history' }"
                class="block px-4 py-2 text-sm font-medium hover:bg-track-yellow"
                @click="showUser = false"
              >
                Pesanan Saya
              </router-link>
              <router-link
                :to="{ name: 'addresses' }"
                class="block px-4 py-2 text-sm font-medium hover:bg-track-yellow"
                @click="showUser = false"
              >
                Alamat Saya
              </router-link>
              <hr class="my-1 border-black/10" />
              <button
                class="block w-full px-4 py-2 text-left text-sm font-medium text-circuit-red hover:bg-circuit-red hover:text-steel-white"
                @click="logout"
              >
                Keluar
              </button>
            </div>
          </div>
        </template>

        <!-- Belum login -->
        <template v-else>
          <router-link :to="{ name: 'login' }" class="btn-race-outline px-4 py-2 text-sm">
            Masuk
          </router-link>
          <router-link :to="{ name: 'register' }" class="btn-race px-4 py-2 text-sm">
            Daftar
          </router-link>
        </template>
      </div>
    </nav>

    <div class="curb-divider"></div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'
import { onMounted, onBeforeUnmount, computed, ref } from 'vue'

const router = useRouter()
const authStore = useAuthStore() as any
const cartStore = useCartStore() as any

const apiBaseUrl = import.meta.env.VITE_API_URL

const user = computed(() => authStore.user)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const initials = computed(() => (user.value?.username?.[0] || '?').toUpperCase())

const cartItems = computed(() => cartStore.items)
const totalItems = computed(() => cartStore.totalItems)

const showCart = ref(false)
const showUser = ref(false)
const cartWrapperRef = ref<HTMLElement | null>(null)
const userWrapperRef = ref<HTMLElement | null>(null)

const toggleCart = () => {
  showCart.value = !showCart.value
  showUser.value = false
}
const toggleUser = () => {
  showUser.value = !showUser.value
  showCart.value = false
}

// Tutup dropdown kalau klik di luar area-nya
const handleClickOutside = (e: MouseEvent) => {
  if (cartWrapperRef.value && !cartWrapperRef.value.contains(e.target as Node)) {
    showCart.value = false
  }
  if (userWrapperRef.value && !userWrapperRef.value.contains(e.target as Node)) {
    showUser.value = false
  }
}

onMounted(() => {
  cartStore.fetchCart()
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

async function logout() {
  try {
    showUser.value = false
    await authStore.logout()
    router.replace({ name: 'login' })
  } catch (error: any) {
    console.error(error)
    alert(error?.response?.data?.message || 'Unknown error')
  }
}
</script>