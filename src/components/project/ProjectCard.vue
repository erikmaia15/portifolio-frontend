<script setup lang="ts">
import { ref } from 'vue';
import type { Project } from '@/types/project';
import { ExternalLink, Sparkles, ImageOff } from 'lucide-vue-next';

interface Props {
  project: Project;
  featured?: boolean;
}

defineProps<Props>();

const imageError = ref(false);

const handleImageError = () => {
  imageError.value = true;
};
</script>

<template>
  <article
    class="group relative flex flex-col justify-between bg-[#0e1411] border border-white/10 hover:border-[#00ff87]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(0,255,135,0.12)]"
  >
    <!-- Image Header with Fallback -->
    <div class="relative w-full h-52 bg-[#151d19] overflow-hidden">
      <img
        v-if="!imageError && project.imageUrl"
        :src="project.imageUrl"
        :alt="project.name"
        loading="lazy"
        @error="handleImageError"
        class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
      />

      <div
        v-else
        class="w-full h-full flex flex-col items-center justify-center text-[#64748b] bg-[#151d19] gap-2 p-4 text-center"
      >
        <ImageOff class="w-8 h-8 text-[#475569]" />
        <span class="text-xs">Visualização não disponível</span>
      </div>

      <!-- Overlay gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-[#0e1411] via-transparent to-transparent opacity-80"
      />

      <!-- Badge / Order -->
      <div class="absolute top-3 left-3 flex items-center gap-1.5">
        <span
          v-if="featured"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#00ff87] text-[#060908] shadow-[0_0_10px_rgba(0,255,135,0.3)]"
        >
          <Sparkles class="w-3 h-3" />
          Destaque
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
      <div class="space-y-2">
        <h3
          class="text-lg font-bold text-[#f8fafc] group-hover:text-[#00ff87] transition-colors leading-snug"
        >
          {{ project.name }}
        </h3>

        <p class="text-sm text-[#94a3b8] line-clamp-3 leading-relaxed">
          {{ project.description }}
        </p>
      </div>

      <!-- Action Button / Link -->
      <div class="pt-4 border-t border-white/5 flex items-center justify-between">
        <a
          :href="project.projectUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-xs font-semibold text-[#00ff87] group/link hover:text-[#34d399] transition"
        >
          <span>Acessar Projeto</span>
          <ExternalLink
            class="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
          />
        </a>

        <span class="text-[11px] text-[#475569]">
          #{{ project.order }}
        </span>
      </div>
    </div>
  </article>
</template>
