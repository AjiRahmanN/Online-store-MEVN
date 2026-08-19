<template>
  <div>
    <!-- HERO -->
    <section class="relative overflow-hidden bg-asphalt">
      <!-- Garis kecepatan dekoratif -->
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.07]"
        style="
          background-image: repeating-linear-gradient(100deg, #edeff2 0 2px, transparent 2px 60px);
        "
      ></div>

      <div class="relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <p class="race-mono mb-3 text-sm font-bold tracking-[0.3em] text-track-yellow uppercase">
          Pit Stop // Mini 4WD &amp; RC
        </p>
        <h1 class="max-w-2xl font-display text-4xl leading-[1.05] font-bold tracking-tight text-steel-white uppercase sm:text-5xl lg:text-6xl">
          Gaspol di Setiap
          <span class="text-track-yellow">Tikungan.</span>
        </h1>
        <p class="mt-4 max-w-lg font-body text-base text-chrome">
          Sparepart, motor tuning, ban, dan bodi lexan pilihan buat mesin balap kesayanganmu.
          Dari garasi ke lintasan, kami yang urus perlengkapannya.
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <a href="#katalog" class="btn-race px-6 py-3">
            Lihat Katalog
          </a>
          <router-link v-if="!isAuthenticated" :to="{ name: 'register' }" class="btn-race-outline px-6 py-3">
            Daftar Akun
          </router-link>
        </div>

        <!-- Spec ticker -->
        <div class="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-5">
          <span
            v-for="tag in ['Mini 4WD', 'RC Car', 'Motor & Gear', 'Ban & Velg', 'Bodi Lexan']"
            :key="tag"
            class="race-mono text-xs font-semibold tracking-widest text-chrome/70 uppercase"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </section>

    <div class="curb-divider"></div>

    <!-- KATALOG -->
    <section id="katalog" class="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-14">
      <div class="mb-6 flex items-end justify-between">
        <div>
          <p class="race-mono text-xs font-bold tracking-widest text-circuit-red uppercase">// Katalog</p>
          <h2 class="font-display text-2xl font-bold tracking-wide text-steel-white uppercase">
            Koleksi Part &amp; Kit
          </h2>
        </div>
      </div>

      <ProductCard />
    </section>
  </div>
</template>

<script setup lang="ts">
import ProductCard from '../components/ProductCard.vue'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore() as any
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>