<template>
  <div class="mx-auto max-w-2xl px-4 py-10 lg:px-8">
    <p class="race-mono text-xs font-bold tracking-widest text-circuit-red uppercase">// Lisensi Pembalap</p>
    <h1 class="mb-6 font-display text-3xl font-bold tracking-wide text-steel-white uppercase">Profil Saya</h1>

    <div v-if="user" class="spec-card p-6">
      <div class="mb-5 flex items-center gap-4">
        <span class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-track-yellow font-display text-2xl font-bold text-asphalt">
          {{ initials }}
        </span>
        <div>
          <h2 class="font-display text-xl font-bold uppercase">{{ user.username }}</h2>
          <p class="text-sm text-asphalt/60">{{ user.email }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 border-t border-black/10 pt-5 sm:grid-cols-2">
        <div>
          <p class="text-xs font-bold tracking-wide text-asphalt/50 uppercase">Nama Depan</p>
          <p class="font-semibold">{{ user.first_name || '—' }}</p>
        </div>
        <div>
          <p class="text-xs font-bold tracking-wide text-asphalt/50 uppercase">Nama Belakang</p>
          <p class="font-semibold">{{ user.last_name || '—' }}</p>
        </div>
        <div class="sm:col-span-2">
          <p class="text-xs font-bold tracking-wide text-asphalt/50 uppercase">Nama Lengkap</p>
          <p class="font-semibold">{{ user.fullName || '—' }}</p>
        </div>
      </div>
    </div>

    <div v-else class="flex justify-center py-16">
      <div class="h-10 w-10 animate-spin rounded-full border-2 border-track-yellow border-t-transparent"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore() as any

const user = computed(() => authStore.userDetail)
const initials = computed(() => (user.value?.username?.[0] || '?').toUpperCase())

async function getUser() {
  await authStore.getUser()
}

getUser()
</script>