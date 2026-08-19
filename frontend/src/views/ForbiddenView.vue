<template>
  <div class="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center overflow-hidden bg-asphalt px-4 text-center">
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.06]"
      style="background-image: repeating-linear-gradient(100deg, #edeff2 0 2px, transparent 2px 60px)"
    ></div>

    <div class="relative">
      <p class="race-mono mb-2 text-sm font-bold tracking-[0.3em] text-circuit-red uppercase">Black Flag</p>
      <h1 class="font-display text-7xl font-bold tracking-tight text-steel-white">403</h1>
      <p class="mt-2 font-display text-xl font-bold tracking-wide text-track-yellow uppercase">Akses Ditolak</p>
      <p class="mx-auto mt-3 max-w-sm text-sm text-chrome">
        Kamu tidak punya izin buat masuk ke area pit ini. Kalau merasa ini keliru, hubungi kru admin.
      </p>
      <router-link :to="{ name: 'home' }" class="btn-race mt-6 inline-flex px-6 py-3">
        Kembali ke Garasi
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>