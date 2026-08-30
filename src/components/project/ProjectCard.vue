<script setup lang="ts">
import { ref } from 'vue'
import type { Project } from '@/types/project'
import { ExternalLink, ImageOff } from 'lucide-vue-next'

interface Props {
  project: Project
  featured?: boolean
}

defineProps<Props>()

const imageError = ref(false)

const handleImageError = () => {
  imageError.value = true
}
</script>

<template>
  <article
    class="project-card card-border-grow group flex flex-col bg-[--surface] border border-[--border-subtle] rounded-lg overflow-hidden transition-all duration-300 hover:border-[--border-accent] hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(99,102,241,0.1)]"
  >
    <!-- Image with scanline overlay -->
    <div class="relative w-full h-48 bg-[--surface-elevated] overflow-hidden">
      <img
        v-if="!imageError && project.imageUrl"
        :src="project.imageUrl"
        :alt="project.name"
        loading="lazy"
        @error="handleImageError"
        class="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
      />
      <div
        v-else
        class="w-full h-full flex flex-col items-center justify-center text-[--text-muted] gap-2"
      >
        <ImageOff class="w-6 h-6" />
        <span class="text-xs font-body">Sem preview</span>
      </div>

      <!-- Scanline overlay (subtle, visible on hover) -->
      <div
        class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 scanline-overlay"
        aria-hidden="true"
      />

      <!-- Gradient overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-[--surface] via-transparent to-transparent opacity-60"
      />

      <!-- Featured badge -->
      <span
        v-if="featured"
        class="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[--accent-warm] text-[--canvas] uppercase tracking-wider"
      >
        destaque
      </span>

      <!-- Order number -->
      <span
        class="absolute top-3 right-3 font-mono text-[10px] text-[--text-muted] bg-[--canvas]/60 backdrop-blur-sm px-1.5 py-0.5 rounded"
      >
        #{{ String(project.order).padStart(2, '0') }}
      </span>
    </div>

    <!-- Content -->
    <div class="p-5 flex-1 flex flex-col justify-between gap-4">
      <div class="space-y-2">
        <h3
          class="text-base font-display font-bold text-[--text-primary] group-hover:text-[--accent] transition-colors duration-200 leading-tight"
        >
          {{ project.name }}
        </h3>
        <p class="text-sm font-body text-[--text-secondary] line-clamp-3 leading-relaxed">
          {{ project.description }}
        </p>
      </div>

      <!-- Link -->
      <a
        :href="project.projectUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[--accent] hover:text-[--accent-hover] transition-colors group/link pt-3 border-t border-[--border-subtle]"
      >
        <span>ver projeto</span>
        <ExternalLink
          class="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200"
        />
      </a>
    </div>
  </article>
</template>

<style scoped>
.scanline-overlay {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(99, 102, 241, 0.03) 2px,
    rgba(99, 102, 241, 0.03) 4px
  );
}

@media (prefers-reduced-motion: reduce) {
  .project-card {
    transition: none !important;
  }
  .project-card:hover {
    transform: none !important;
    box-shadow: none !important;
  }
}
</style>
