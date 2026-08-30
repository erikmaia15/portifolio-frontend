<script setup lang="ts">
import type { Project } from '@/types/project'
import ProjectCard from './ProjectCard.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import { FolderGit2 } from 'lucide-vue-next'

interface Props {
  projects: Project[]
  loading?: boolean
  limit?: number
  highlightFirst?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  limit: undefined,
  highlightFirst: false,
})
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
      class="text-center py-16 px-4 bg-[--surface] border border-[--border-subtle] rounded-lg max-w-md mx-auto space-y-3"
    >
      <div
        class="w-12 h-12 rounded-md bg-[--surface-elevated] border border-[--border-subtle] flex items-center justify-center text-[--text-muted] mx-auto"
      >
        <FolderGit2 class="w-6 h-6" />
      </div>
      <h4 class="text-base font-display font-bold text-[--text-primary]">Nenhum projeto encontrado</h4>
      <p class="text-xs font-body text-[--text-secondary]">
        Em breve novos projetos serão publicados aqui.
      </p>
    </div>

    <!-- Projects Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
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
