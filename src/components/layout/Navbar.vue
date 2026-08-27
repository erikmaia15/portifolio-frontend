<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import {
  Code2,
  FolderGit2,
  User,
  Send,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-vue-next';
import BaseButton from '@/components/ui/BaseButton.vue';

const authStore = useAuthStore();
const route = useRoute();
const isMobileMenuOpen = ref(false);

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogout = () => {
  authStore.logout();
  closeMobileMenu();
};
</script>

<template>
  <header
    class="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#060908]/85 border-b border-white/5 transition-all"
  >
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
    >
      <!-- Logo -->
      <RouterLink
        to="/"
        class="flex items-center gap-2.5 text-white font-bold text-lg tracking-tight group"
        @click="closeMobileMenu"
      >
        <div
          class="w-9 h-9 rounded-lg bg-[#0e1411] border border-[#00ff87]/30 flex items-center justify-center text-[#00ff87] group-hover:border-[#00ff87] group-hover:shadow-[0_0_15px_rgba(0,255,135,0.3)] transition-all duration-300"
        >
          <Code2 class="w-5 h-5" />
        </div>
        <span class="flex items-center gap-1">
          <span>erik</span>
          <span class="text-[#00ff87]">.dev</span>
          <span
            class="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-pulse inline-block ml-0.5"
          />
        </span>
      </RouterLink>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-1">
        <RouterLink
          to="/"
          class="px-3.5 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="[
            route.path === '/'
              ? 'text-[#00ff87] bg-[#00ff87]/10'
              : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/5',
          ]"
        >
          Início
        </RouterLink>

        <RouterLink
          to="/projetos"
          class="px-3.5 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="[
            route.path === '/projetos'
              ? 'text-[#00ff87] bg-[#00ff87]/10'
              : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/5',
          ]"
        >
          Projetos
        </RouterLink>

        <a
          href="/#sobre"
          class="px-3.5 py-2 text-sm font-medium text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/5 rounded-lg transition-colors"
        >
          Sobre
        </a>

        <a
          href="/#contato"
          class="px-3.5 py-2 text-sm font-medium text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/5 rounded-lg transition-colors"
        >
          Contato
        </a>
      </nav>

      <!-- Right Action CTAs -->
      <div class="hidden md:flex items-center gap-3">
        <!-- If Admin Logged In -->
        <template v-if="authStore.isAuthenticated">
          <RouterLink
            to="/admin/dashboard"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#00ff87] bg-[#00ff87]/10 border border-[#00ff87]/30 rounded-lg hover:bg-[#00ff87]/20 transition"
          >
            <LayoutDashboard class="w-3.5 h-3.5" />
            Painel Admin
          </RouterLink>

          <button
            @click="handleLogout"
            title="Sair"
            class="text-[#94a3b8] hover:text-red-400 p-2 rounded-lg hover:bg-white/5 transition"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </template>

        <!-- If Public Visitor -->
        <template v-else>
          <a
            href="/#contato"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#060908] bg-[#00ff87] hover:bg-[#34d399] rounded-lg shadow-[0_0_15px_rgba(0,255,135,0.2)] hover:shadow-[0_0_20px_rgba(0,255,135,0.35)] transition duration-200"
          >
            <Send class="w-3.5 h-3.5" />
            Fale Comigo
          </a>
        </template>
      </div>

      <!-- Mobile Menu Toggle Button -->
      <button
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="md:hidden text-[#94a3b8] hover:text-[#f8fafc] p-2 rounded-lg hover:bg-white/5 transition"
        aria-label="Abrir menu"
      >
        <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
        <X v-else class="w-6 h-6" />
      </button>
    </div>

    <!-- Mobile Dropdown Navigation -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden px-4 pt-3 pb-6 bg-[#0e1411] border-b border-white/10 space-y-2"
      >
        <RouterLink
          to="/"
          @click="closeMobileMenu"
          class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg"
          :class="[
            route.path === '/'
              ? 'text-[#00ff87] bg-[#00ff87]/10'
              : 'text-[#94a3b8]',
          ]"
        >
          <Code2 class="w-4 h-4" />
          Início
        </RouterLink>

        <RouterLink
          to="/projetos"
          @click="closeMobileMenu"
          class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg"
          :class="[
            route.path === '/projetos'
              ? 'text-[#00ff87] bg-[#00ff87]/10'
              : 'text-[#94a3b8]',
          ]"
        >
          <FolderGit2 class="w-4 h-4" />
          Projetos
        </RouterLink>

        <a
          href="/#sobre"
          @click="closeMobileMenu"
          class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#94a3b8]"
        >
          <User class="w-4 h-4" />
          Sobre
        </a>

        <a
          href="/#contato"
          @click="closeMobileMenu"
          class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#94a3b8]"
        >
          <Send class="w-4 h-4" />
          Contato
        </a>

        <div class="pt-3 border-t border-white/10 space-y-2">
          <template v-if="authStore.isAuthenticated">
            <RouterLink
              to="/admin/dashboard"
              @click="closeMobileMenu"
              class="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/30 text-sm font-semibold"
            >
              <LayoutDashboard class="w-4 h-4" />
              Painel Admin
            </RouterLink>

            <button
              @click="handleLogout"
              class="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-semibold"
            >
              <LogOut class="w-4 h-4" />
              Encerrar Sessão
            </button>
          </template>

          <template v-else>
            <a
              href="/#contato"
              @click="closeMobileMenu"
              class="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#00ff87] text-[#060908] font-bold text-sm shadow-[0_0_15px_rgba(0,255,135,0.25)]"
            >
              <Send class="w-4 h-4" />
              Fale Comigo
            </a>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>
