<script setup lang="ts">
import type { Project } from '@/types/project';
import ProjectCard from './ProjectCard.vue';
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue';
import { FolderGit2 } from 'lucide-vue-next';

interface Props {
  projects: Project[];
  loading?: boolean;
  limit?: number;
  highlightFirst?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  limit: undefined,
  highlightFirst: false,
});
</script>

<template>
  <div>
    <!-- Loading State -->
    <SkeletonLoader
      v-if="loading"
      type="card"
      :count="limit || 6"
    />

    <!-- Empty State -->
    <div
      v-else-if="!projects || projects.length === 0"
      class="text-center py-16 px-4 bg-[#0e1411] border border-white/5 rounded-2xl max-w-md mx-auto space-y-3"
    >
      <div
        class="w-12 h-12 rounded-xl bg-[#151d19] border border-white/10 flex items-center justify-center text-[#64748b] mx-auto"
      >
        <FolderGit2 class="w-6 h-6" />
      </div>
      <h4 class="text-base font-semibold text-white">Nenhum projeto encontrado</h4>
      <p class="text-xs text-[#94a3b8]">
        Em breve novos projetos estarão disponíveis aqui.
      </p>
    </div>

    <!-- Projects Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <ProjectCard
        v-for="(project, index) in (limit ? projects.slice(0, limit) : projects)"
        :key="project.id"
        :project="project"
        :featured="highlightFirst && index === 0"
      />
    </div>
  </div>
</template>
