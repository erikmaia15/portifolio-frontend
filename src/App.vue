<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'

const route = useRoute()
const authStore = useAuthStore()

const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin') && route.path !== '/admin/login'
})

const isLoginRoute = computed(() => {
  return route.path === '/admin/login'
})

const isPublicRoute = computed(() => !isAdminRoute.value && !isLoginRoute.value)

onMounted(() => {
  authStore.checkAuth()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[--canvas] text-[--text-primary] relative">
    <!-- Ambient background blobs (public pages only) -->
    <template v-if="isPublicRoute">
      <div class="ambient-blob-1" aria-hidden="true" />
      <div class="ambient-blob-2" aria-hidden="true" />
    </template>

    <!-- Public Header -->
    <Navbar v-if="isPublicRoute" />

    <!-- Main Content -->
    <main class="flex-1 relative z-10">
      <RouterView />
    </main>

    <!-- Public Footer -->
    <Footer v-if="isPublicRoute" />

    <!-- Global Toast Notifications -->
    <ToastNotification />
  </div>
</template>
