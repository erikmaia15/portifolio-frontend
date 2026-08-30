<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { gsap } from 'gsap'
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
} from 'lucide-vue-next'

const authStore = useAuthStore()
const route = useRoute()
const isMobileMenuOpen = ref(false)

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  closeMobileMenu()
}

const navLinks = [
  { to: '/', label: 'Início', hash: false },
  { to: '/projetos', label: 'Projetos', hash: false },
  { to: '/#sobre', label: 'Sobre', hash: true },
  { to: '/#contato', label: 'Contato', hash: true },
]

const handleNavClick = (link: { to: string; hash: boolean; label: string }, event: Event) => {
  closeMobileMenu()

  if (link.hash && route.path === '/') {
    event.preventDefault()
    const hash = link.to.substring(link.to.indexOf('#'))
    const targetEl = document.getElementById(hash.substring(1))
    if (targetEl) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) {
        targetEl.scrollIntoView({ block: 'start' })
      } else {
        const targetY = targetEl.getBoundingClientRect().top + window.scrollY
        const scrollObj = { y: window.scrollY }
        gsap.to(scrollObj, {
          y: targetY,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate: () => {
            window.scrollTo(0, scrollObj.y)
          }
        })
      }
      window.history.pushState(null, '', link.to)
    }
  }
}

const handleContactClick = (event: Event) => {
  closeMobileMenu()
  if (route.path === '/') {
    event.preventDefault()
    const targetEl = document.getElementById('contato')
    if (targetEl) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) {
        targetEl.scrollIntoView({ block: 'start' })
      } else {
        const targetY = targetEl.getBoundingClientRect().top + window.scrollY
        const scrollObj = { y: window.scrollY }
        gsap.to(scrollObj, {
          y: targetY,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate: () => {
            window.scrollTo(0, scrollObj.y)
          }
        })
      }
      window.history.pushState(null, '', '/#contato')
    }
  }
}
</script>

<template>
  <header
    class="sticky top-0 z-40 w-full backdrop-blur-xl bg-[--canvas]/90 border-b border-[--border-subtle] transition-all"
  >
    <div
      class="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between"
    >
      <!-- Logo -->
      <RouterLink
        to="/"
        class="flex items-center gap-2 font-display text-lg tracking-tight group"
        @click="closeMobileMenu"
      >
        <span class="text-[--text-primary] group-hover:text-[--accent] transition-colors duration-200">
          erik
        </span>
        <span class="text-[--accent]">.dev</span>
      </RouterLink>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-1">
        <template v-for="link in navLinks" :key="link.to">
          <RouterLink
            :to="link.to"
            @click="handleNavClick(link, $event)"
            class="px-3 py-2 text-sm font-body font-medium rounded-md transition-colors duration-200"
            :class="[
              (link.hash ? route.hash === link.to.substring(link.to.indexOf('#')) : route.path === link.to && !route.hash)
                ? 'text-[--accent] bg-[--accent-dim]'
                : 'text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--surface]',
            ]"
          >
            {{ link.label }}
          </RouterLink>
        </template>
      </nav>

      <!-- Right Actions -->
      <div class="hidden md:flex items-center gap-3">
        <template v-if="authStore.isAuthenticated">
          <RouterLink
            to="/admin/dashboard"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-[--accent] bg-[--accent-dim] border border-[--border-accent] rounded-md hover:bg-[--accent]/20 transition-colors"
          >
            <LayoutDashboard class="w-3.5 h-3.5" />
            Painel
          </RouterLink>
          <button
            @click="handleLogout"
            title="Sair"
            class="text-[--text-secondary] hover:text-[--danger] p-2 rounded-md hover:bg-[--surface] transition-colors"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </template>

        <template v-else>
          <RouterLink
            to="/#contato"
            @click="handleContactClick($event)"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-body font-semibold text-[--canvas] bg-[--accent] hover:bg-[--accent-hover] rounded-md transition-colors duration-200"
          >
            Fale Comigo
            <ArrowUpRight class="w-3.5 h-3.5" />
          </RouterLink>
        </template>
      </div>

      <!-- Mobile Menu Toggle -->
      <button
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="md:hidden text-[--text-secondary] hover:text-[--text-primary] p-2 rounded-md hover:bg-[--surface] transition-colors"
        :aria-label="isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'"
        aria-expanded="false"
      >
        <Menu v-if="!isMobileMenuOpen" class="w-5 h-5" />
        <X v-else class="w-5 h-5" />
      </button>
    </div>

    <!-- Mobile Dropdown -->
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
        class="md:hidden px-5 pt-2 pb-6 bg-[--surface] border-b border-[--border-subtle] space-y-1"
      >
        <template v-for="link in navLinks" :key="link.to">
          <RouterLink
            :to="link.to"
            @click="handleNavClick(link, $event)"
            class="block px-3 py-2.5 text-sm font-body font-medium rounded-md"
            :class="[
              (link.hash ? route.hash === link.to.substring(link.to.indexOf('#')) : route.path === link.to && !route.hash)
                ? 'text-[--accent] bg-[--accent-dim]'
                : 'text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--surface-elevated]',
            ]"
          >
            {{ link.label }}
          </RouterLink>
        </template>

        <div class="pt-3 mt-2 border-t border-[--border-subtle]">
          <template v-if="authStore.isAuthenticated">
            <RouterLink
              to="/admin/dashboard"
              @click="closeMobileMenu"
              class="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-md bg-[--accent-dim] text-[--accent] border border-[--border-accent] text-sm font-medium"
            >
              <LayoutDashboard class="w-4 h-4" />
              Painel Admin
            </RouterLink>
            <button
              @click="handleLogout"
              class="flex items-center justify-center gap-2 w-full mt-2 py-2.5 px-4 rounded-md bg-[--danger-surface] text-[--danger] border border-[--danger-border] text-sm font-medium"
            >
              <LogOut class="w-4 h-4" />
              Encerrar Sessão
            </button>
          </template>

          <template v-else>
            <RouterLink
              to="/#contato"
              @click="handleContactClick($event)"
              class="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-md bg-[--accent] text-[--canvas] font-semibold text-sm"
            >
              Fale Comigo
              <ArrowUpRight class="w-4 h-4" />
            </RouterLink>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>
