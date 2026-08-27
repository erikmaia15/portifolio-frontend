<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import AdminSidebar from './AdminSidebar.vue';
import { Menu, X, Shield } from 'lucide-vue-next';

const isMobileSidebarOpen = ref(false);
</script>

<template>
  <div class="min-h-screen bg-[#060908] flex flex-col md:flex-row">
    <!-- Desktop Sidebar -->
    <div class="hidden md:block">
      <AdminSidebar class="sticky top-0" />
    </div>

    <!-- Mobile Header -->
    <div
      class="md:hidden sticky top-0 z-30 bg-[#0e1411] border-b border-white/10 px-4 py-3 flex items-center justify-between"
    >
      <div class="flex items-center gap-2.5">
        <div
          class="w-7 h-7 rounded-md bg-[#00ff87]/10 border border-[#00ff87]/30 flex items-center justify-center text-[#00ff87]"
        >
          <Shield class="w-4 h-4" />
        </div>
        <span class="text-sm font-bold text-white">Painel Admin</span>
      </div>

      <button
        @click="isMobileSidebarOpen = !isMobileSidebarOpen"
        class="text-[#94a3b8] hover:text-white p-1.5 rounded-lg hover:bg-white/5"
      >
        <Menu v-if="!isMobileSidebarOpen" class="w-5 h-5" />
        <X v-else class="w-5 h-5" />
      </button>
    </div>

    <!-- Mobile Drawer Sidebar -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="isMobileSidebarOpen"
        class="md:hidden fixed inset-0 z-50 flex"
      >
        <div class="w-64 max-w-[80vw] h-full shadow-2xl">
          <AdminSidebar
            :is-mobile-open="true"
            @close="isMobileSidebarOpen = false"
          />
        </div>
        <div
          class="flex-1 bg-black/60 backdrop-blur-sm"
          @click="isMobileSidebarOpen = false"
        />
      </div>
    </Transition>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div class="max-w-6xl mx-auto">
        <slot />
      </div>
    </main>
  </div>
</template>
