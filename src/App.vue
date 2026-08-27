<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import ToastNotification from '@/components/ui/ToastNotification.vue';

const route = useRoute();
const authStore = useAuthStore();

// Identify if the active route is inside the admin section
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin') && route.path !== '/admin/login';
});

const isLoginRoute = computed(() => {
  return route.path === '/admin/login';
});

onMounted(() => {
  authStore.checkAuth();
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#060908] text-[#f8fafc] bg-grid-pattern bg-radial-gradient">
    <!-- Public Header (shown on public pages & 404) -->
    <Navbar v-if="!isAdminRoute && !isLoginRoute" />

    <!-- Main Content -->
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          mode="out-in"
        >
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- Public Footer (shown on public pages) -->
    <Footer v-if="!isAdminRoute && !isLoginRoute" />

    <!-- Global Toast Notifications -->
    <ToastNotification />
  </div>
</template>
