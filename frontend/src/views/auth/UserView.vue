<template>
  <h1>User Page</h1>
  <div class="user">
    <div class="container">
      <div v-if="user" class="card card-body mt-4">
        <h5 class="card-title">Username: {{user.username}}</h5>
        <h6 class="card-subtitle mb2 text-muted">email: {{user.email}}</h6>
        <h6 class="card-subtitle mb2 text-muted">First Name: {{user.first_name}}</h6>
        <h6 class="card-subtitle mb2 text-muted">Last Name: {{ user.last_name }}</h6>
        <h6 class="card-subtitle mb2 text-muted">Full Name: {{ user.fullName }}</h6>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore} from '../../stores/auth';
import { computed} from 'vue'

const authStore = useAuthStore() as any

const user = computed(() =>{
  return authStore.userDetail}) 

async function getUser() {
  await authStore.getUser()
}

getUser()
</script>

<style>
#user .card {
  max-width: 40vw;
  margin: auto;
}
</style>