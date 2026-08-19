<template>
  <header class="sticky top-0 z-40 bg-asphalt">
    <nav class="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
      <!-- Logo -->
      <router-link :to="{ name: 'adminproducts' }" class="flex shrink-0 items-center gap-2.5">
        <span class="corner-cut flex h-10 w-10 items-center justify-center bg-track-yellow font-display text-lg font-bold text-asphalt">
          M4
        </span>
        <span class="font-display text-xl leading-none font-bold tracking-wide text-steel-white uppercase">
          Mendo<span class="text-circuit-red">Racing</span>
        </span>
        <span class="corner-cut bg-circuit-red px-2 py-0.5 font-display text-[10px] font-bold tracking-widest text-steel-white uppercase">
          Admin
        </span>
      </router-link>

      <div class="ml-6 hidden items-center gap-1 lg:flex">
        <router-link
          :to="{ name: 'adminproducts' }"
          class="corner-cut px-3 py-1.5 font-display text-sm font-semibold tracking-wide uppercase"
          :class="isActive('adminproducts') ? 'bg-track-yellow text-asphalt' : 'text-chrome hover:text-track-yellow'"
        >
          Daftar Produk
        </router-link>
        <router-link
          :to="{ name: 'TambahProduct' }"
          class="corner-cut px-3 py-1.5 font-display text-sm font-semibold tracking-wide uppercase"
          :class="isActive('TambahProduct') ? 'bg-track-yellow text-asphalt' : 'text-chrome hover:text-track-yellow'"
        >
          Tambah Produk
        </router-link>
      </div>

      <div class="ml-auto flex items-center gap-2">
        <div class="relative" ref="userWrapperRef">
          <button
            type="button"
            class="flex h-10 items-center gap-2 corner-cut border border-white/10 bg-asphalt-light px-3 text-sm font-semibold text-steel-white hover:border-track-yellow"
            @click="showUser = !showUser"
          >
            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-track-yellow text-xs font-bold text-asphalt">
              {{ initials }}
            </span>
            <span class="hidden max-w-24 truncate lg:inline">{{ user?.username }}</span>
          </button>

          <div v-if="showUser" class="spec-card absolute right-0 z-20 mt-2 w-48 py-1">
            <router-link
              :to="{ name: 'user' }"
              class="block px-4 py-2 text-sm font-medium hover:bg-track-yellow"
              @click="showUser = false"
            >
              Profil Saya
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
      </div>
    </nav>

    <div class="curb-divider curb-divider--yellow"></div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { onMounted, onBeforeUnmount, computed, ref } from 'vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore() as any

const user = computed(() => authStore.user)
const initials = computed(() => (user.value?.username?.[0] || '?').toUpperCase())

const showUser = ref(false)
const userWrapperRef = ref<HTMLElement | null>(null)

const isActive = (name: string) => route.name === name

const handleClickOutside = (e: MouseEvent) => {
  if (userWrapperRef.value && !userWrapperRef.value.contains(e.target as Node)) {
    showUser.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

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