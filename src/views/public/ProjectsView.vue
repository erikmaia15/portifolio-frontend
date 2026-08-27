<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProjectsStore } from '@/stores/projects.store';
import ProjectGrid from '@/components/project/ProjectGrid.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { Search, FolderGit2, RefreshCw, Sparkles } from 'lucide-vue-next';

const projectsStore = useProjectsStore();
const searchQuery = ref('');

const loadProjects = () => {
  projectsStore.fetchProjects().catch(() => {
    // Handled in store
  });
};

onMounted(() => {
  loadProjects();
});

const filteredProjects = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return projectsStore.sortedProjects;

  return projectsStore.sortedProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
  );
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
    <!-- Header Section -->
    <div class="text-center max-w-2xl mx-auto space-y-4">
      <div
        class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0e1411] border border-[#00ff87]/30 text-xs font-semibold text-[#00ff87]"
      >
        <FolderGit2 class="w-3.5 h-3.5" />
        Galeria de Trabalhos
      </div>

      <h1 class="text-3xl sm:text-5xl font-extrabold text-[#f8fafc] tracking-tight">
        Projetos & Aplicações
      </h1>

      <p class="text-sm sm:text-base text-[#94a3b8]">
        Explore as soluções desenvolvidas, arquiteturas implementadas e repositórios de código aberto.
      </p>
    </div>

    <!-- Search & Filter Bar -->
    <div class="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-4">
      <BaseInput
        v-model="searchQuery"
        placeholder="Buscar por nome ou tecnologia..."
        type="search"
      >
        <template #prefix>
          <Search class="w-4 h-4" />
        </template>
      </BaseInput>
    </div>

    <!-- Error State with Retry -->
    <div
      v-if="projectsStore.error && !projectsStore.isLoading"
      class="max-w-md mx-auto p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center space-y-4"
    >
      <p class="text-sm text-red-400 font-medium">
        {{ projectsStore.error }}
      </p>
      <BaseButton
        variant="outline"
        size="sm"
        @click="loadProjects"
      >
        <template #icon-left>
          <RefreshCw class="w-3.5 h-3.5" />
        </template>
        Tentar Novamente
      </BaseButton>
    </div>

    <!-- Projects Grid Display -->
    <div v-else class="space-y-6">
      <div class="flex items-center justify-between text-xs text-[#94a3b8] px-1">
        <span>
          Exibindo
          <strong class="text-[#00ff87]">{{ filteredProjects.length }}</strong>
          {{ filteredProjects.length === 1 ? 'projeto' : 'projetos' }}
        </span>

        <span v-if="searchQuery" class="text-[#64748b]">
          Filtrado por: "{{ searchQuery }}"
        </span>
      </div>

      <ProjectGrid
        :projects="filteredProjects"
        :loading="projectsStore.isLoading"
      />
    </div>
  </div>
</template>
