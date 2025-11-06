<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from './stores/auth'
import NavbarUser from './components/NavbarUser.vue'
import NavbarAdmin from './components/NavbarAdmin.vue'

const authStore = useAuthStore()
const currentNavbar = computed(() => {
  if (authStore.user?.roles?.includes('admin')) return NavbarAdmin
  else return NavbarUser
})

</script>

<template>
  <component :is="currentNavbar" v-if="currentNavbar" />
   <RouterView />
</template>

<style scoped>

</style>
