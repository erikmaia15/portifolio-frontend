<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Github, Linkedin, Mail } from 'lucide-vue-next'

const currentYear = new Date().getFullYear()

const socialLinks = [
  { href: 'https://github.com/erikmaia15', icon: Github, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/erik-maia-0a326237b', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:erik.maia15oliveira@gmail.com', icon: Mail, label: 'Email' },
]
</script>

<template>
  <footer
    class="relative z-10 border-t border-[--border-subtle] py-10 px-5 sm:px-8 mt-auto"
  >
    <div
      class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6"
    >
      <div class="flex items-center gap-4">
        <span class="font-display text-sm tracking-tight">
          erik<span class="text-[--accent]">.dev</span>
        </span>
        <span class="text-[--text-muted] text-xs font-mono">© {{ currentYear }}</span>
      </div>

      <div class="flex items-center gap-3">
        <a
          v-for="link in socialLinks"
          :key="link.label"
          :href="link.href"
          :target="link.href.startsWith('mailto') ? undefined : '_blank'"
          :rel="link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'"
          class="w-8 h-8 rounded-md bg-[--surface] border border-[--border-subtle] flex items-center justify-center text-[--text-secondary] hover:text-[--accent] hover:border-[--border-accent] transition-colors duration-200"
          :aria-label="link.label"
        >
          <component :is="link.icon" class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>

    <div
      class="max-w-6xl mx-auto mt-6 pt-4 border-t border-[--border-subtle] flex items-center justify-center"
    >
      <RouterLink
        to="/admin/login"
        class="text-[--text-muted] text-xs font-mono hover:text-[--text-secondary] transition-colors"
      >
        admin
      </RouterLink>
    </div>
  </footer>
</template>
