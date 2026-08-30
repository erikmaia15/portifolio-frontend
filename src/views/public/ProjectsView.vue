<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from '@/stores/projects.store'
import ProjectGrid from '@/components/project/ProjectGrid.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { Search, RefreshCw } from 'lucide-vue-next'

const projectsStore = useProjectsStore()
const searchQuery = ref('')

const loadProjects = () => {
  projectsStore.fetchProjects().catch(() => {})
}

onMounted(() => {
  loadProjects()
})

const filteredProjects = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return projectsStore.sortedProjects

  return projectsStore.sortedProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
  )
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-20 space-y-12">
    <!-- Header -->
    <div class="max-w-2xl space-y-4">
      <span class="section-label">02 · Projetos</span>
      <h1 class="text-3xl sm:text-4xl font-display font-bold text-[--text-primary] tracking-tight">
        O que eu construí
      </h1>
      <p class="text-sm sm:text-base font-body text-[--text-secondary] leading-relaxed">
        Cada projeto aqui resolve um problema real. APIs, interfaces, pipelines de dados — explore o código e as decisões por trás de cada um.
      </p>
    </div>

    <!-- Search -->
    <div class="max-w-sm">
      <BaseInput
        v-model="searchQuery"
        placeholder="Buscar por nome ou descrição..."
        type="search"
      >
        <template #prefix>
          <Search class="w-4 h-4" />
        </template>
      </BaseInput>
    </div>

    <!-- Error State -->
    <div
      v-if="projectsStore.error && !projectsStore.isLoading"
      class="max-w-md p-6 bg-[--danger-surface] border border-[--danger-border] rounded-lg space-y-4"
    >
      <p class="text-sm text-red-400 font-body font-medium">
        {{ projectsStore.error }}
      </p>
      <BaseButton variant="outline" size="sm" @click="loadProjects">
        <template #icon-left>
          <RefreshCw class="w-3.5 h-3.5" />
        </template>
        Tentar Novamente
      </BaseButton>
    </div>

    <!-- Projects Grid -->
    <div v-else class="space-y-4">
      <div class="flex items-center justify-between text-xs font-mono text-[--text-muted] px-1">
        <span>
          {{ filteredProjects.length }} {{ filteredProjects.length === 1 ? 'projeto' : 'projetos' }}
        </span>
        <span v-if="searchQuery" class="text-[--text-muted]">
          filtro: "{{ searchQuery }}"
        </span>
      </div>

      <ProjectGrid
        :projects="filteredProjects"
        :loading="projectsStore.isLoading"
      />
    </div>
  </div>
</template>
