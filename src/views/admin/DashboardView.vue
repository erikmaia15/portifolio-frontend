<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { useProjectsStore } from '@/stores/projects.store';
import { useToastStore } from '@/stores/toast.store';
import type { Project } from '@/types/project';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue';
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue';
import {
  PlusCircle,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
  Calendar,
  ImageOff,
  RefreshCw,
} from 'lucide-vue-next';

const projectsStore = useProjectsStore();
const toastStore = useToastStore();

const searchQuery = ref('');
const isDeleteDialogOpen = ref(false);
const projectToDelete = ref<Project | null>(null);
const isDeleting = ref(false);

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

const promptDelete = (project: Project) => {
  projectToDelete.value = project;
  isDeleteDialogOpen.value = true;
};

const handleConfirmDelete = async () => {
  if (!projectToDelete.value) return;

  isDeleting.value = true;
  try {
    await projectsStore.deleteProject(projectToDelete.value.id);
    toastStore.success('Projeto removido com sucesso!');
    isDeleteDialogOpen.value = false;
    projectToDelete.value = null;
  } catch (err: any) {
    toastStore.error(
      err.response?.data?.message || 'Não foi possível excluir o projeto.'
    );
  } finally {
    isDeleting.value = false;
  }
};

const formatDate = (dateStr: string) => {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return '—';
  }
};
</script>

<template>
  <AdminLayout>
    <div class="space-y-8">
      <!-- Top Title & CTAs -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5"
      >
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] tracking-tight">
            Gerenciamento de Projetos
          </h1>
          <p class="text-xs sm:text-sm text-[#94a3b8] mt-1">
            Crie, edite, organize e remova os projetos exibidos no seu portfólio.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <BaseButton
            variant="ghost"
            size="sm"
            @click="loadProjects"
            :loading="projectsStore.isLoading"
            title="Atualizar lista"
          >
            <template #icon-left>
              <RefreshCw class="w-4 h-4" />
            </template>
            Atualizar
          </BaseButton>

          <BaseButton
            variant="primary"
            size="md"
            to="/admin/projects/novo"
          >
            <template #icon-left>
              <PlusCircle class="w-4 h-4" />
            </template>
            Novo Projeto
          </BaseButton>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-[#0e1411] border border-white/5 rounded-xl p-5 space-y-1">
          <span class="text-xs text-[#94a3b8] font-medium uppercase tracking-wider">
            Total de Projetos
          </span>
          <p class="text-2xl font-bold text-[#00ff87]">
            {{ projectsStore.projects.length }}
          </p>
        </div>

        <div class="bg-[#0e1411] border border-white/5 rounded-xl p-5 space-y-1">
          <span class="text-xs text-[#94a3b8] font-medium uppercase tracking-wider">
            Em Destaque (Top 3)
          </span>
          <p class="text-2xl font-bold text-[#f8fafc]">
            {{ Math.min(projectsStore.projects.length, 3) }}
          </p>
        </div>

        <div class="bg-[#0e1411] border border-white/5 rounded-xl p-5 space-y-1">
          <span class="text-xs text-[#94a3b8] font-medium uppercase tracking-wider">
            Status da API
          </span>
          <p class="text-sm font-semibold text-[#00ff87] flex items-center gap-2 mt-1">
            <span class="w-2 h-2 rounded-full bg-[#00ff87] animate-pulse" />
            Conectada
          </p>
        </div>
      </div>

      <!-- Filter / Search -->
      <div class="flex items-center justify-between gap-4">
        <div class="w-full max-w-sm">
          <BaseInput
            v-model="searchQuery"
            placeholder="Filtrar por título..."
            type="search"
          >
            <template #prefix>
              <Search class="w-4 h-4" />
            </template>
          </BaseInput>
        </div>

        <span class="text-xs text-[#64748b] hidden sm:block">
          {{ filteredProjects.length }} projetos listados
        </span>
      </div>

      <!-- Table / Project List -->
      <div class="bg-[#0e1411] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <!-- Loading -->
        <div v-if="projectsStore.isLoading" class="p-6">
          <SkeletonLoader type="table-row" :count="4" />
        </div>

        <!-- Empty State -->
        <div
          v-else-if="filteredProjects.length === 0"
          class="text-center py-16 px-4 space-y-4"
        >
          <div
            class="w-12 h-12 rounded-xl bg-[#151d19] border border-white/10 flex items-center justify-center text-[#64748b] mx-auto"
          >
            <Layers class="w-6 h-6" />
          </div>
          <div class="space-y-1">
            <h4 class="text-base font-bold text-white">Nenhum projeto encontrado</h4>
            <p class="text-xs text-[#94a3b8]">
              {{
                searchQuery
                  ? 'Nenhum resultado corresponde à sua busca.'
                  : 'Você ainda não cadastrou nenhum projeto no portfólio.'
              }}
            </p>
          </div>
          <BaseButton
            v-if="!searchQuery"
            variant="primary"
            size="sm"
            to="/admin/projects/novo"
          >
            <template #icon-left>
              <PlusCircle class="w-4 h-4" />
            </template>
            Cadastrar Primeiro Projeto
          </BaseButton>
        </div>

        <!-- Projects Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm text-[#94a3b8]">
            <thead class="bg-[#151d19] text-xs font-semibold uppercase tracking-wider text-[#cbd5e1] border-b border-white/5">
              <tr>
                <th scope="col" class="px-6 py-3.5">Projeto</th>
                <th scope="col" class="px-4 py-3.5 hidden md:table-cell">Ordem</th>
                <th scope="col" class="px-4 py-3.5 hidden lg:table-cell">Criado em</th>
                <th scope="col" class="px-6 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr
                v-for="project in filteredProjects"
                :key="project.id"
                class="hover:bg-white/[0.02] transition-colors"
              >
                <!-- Image & Info -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-4">
                    <div
                      class="w-14 h-14 rounded-lg bg-[#151d19] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center"
                    >
                      <img
                        v-if="project.imageUrl"
                        :src="project.imageUrl"
                        :alt="project.name"
                        class="w-full h-full object-cover"
                        @error="(e: any) => e.target.style.display = 'none'"
                      />
                      <ImageOff v-else class="w-5 h-5 text-[#475569]" />
                    </div>

                    <div class="min-w-0 max-w-md">
                      <h4 class="font-bold text-[#f8fafc] text-sm truncate">
                        {{ project.name }}
                      </h4>
                      <p class="text-xs text-[#64748b] line-clamp-1 mt-0.5">
                        {{ project.description }}
                      </p>
                      <a
                        :href="project.projectUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1 text-[11px] text-[#00ff87] hover:underline mt-1"
                      >
                        <span class="truncate max-w-[200px]">{{ project.projectUrl }}</span>
                        <ExternalLink class="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>
                </td>

                <!-- Ordem -->
                <td class="px-4 py-4 hidden md:table-cell">
                  <span class="px-2.5 py-1 rounded bg-[#151d19] border border-white/10 text-xs font-mono text-[#00ff87]">
                    #{{ project.order }}
                  </span>
                </td>

                <!-- Data -->
                <td class="px-4 py-4 hidden lg:table-cell text-xs text-[#64748b]">
                  <div class="flex items-center gap-1.5">
                    <Calendar class="w-3.5 h-3.5" />
                    {{ formatDate(project.createdAt) }}
                  </div>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <RouterLink
                      :to="`/admin/projects/${project.id}/editar`"
                      class="p-2 rounded-lg text-[#94a3b8] hover:text-[#00ff87] hover:bg-white/5 transition"
                      title="Editar projeto"
                    >
                      <Edit2 class="w-4 h-4" />
                    </RouterLink>

                    <button
                      @click="promptDelete(project)"
                      class="p-2 rounded-lg text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10 transition"
                      title="Excluir projeto"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <ConfirmDialog
      :is-open="isDeleteDialogOpen"
      title="Excluir Projeto"
      :message="`Tem certeza que deseja remover o projeto '${projectToDelete?.name}'? Esta ação não pode ser desfeita.`"
      confirm-text="Sim, Excluir"
      cancel-text="Cancelar"
      :is-destructive="true"
      :loading="isDeleting"
      @confirm="handleConfirmDelete"
      @cancel="isDeleteDialogOpen = false"
    />
  </AdminLayout>
</template>
