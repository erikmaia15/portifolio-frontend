<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import ProjectForm from '@/components/project/ProjectForm.vue';
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { useProjectsStore } from '@/stores/projects.store';
import { useToastStore } from '@/stores/toast.store';
import type { Project, CreateProjectPayload } from '@/types/project';
import { ArrowLeft, Edit3, AlertCircle } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const projectsStore = useProjectsStore();
const toastStore = useToastStore();

const projectId = route.params.id as string;
const project = ref<Project | null>(null);
const isLoading = ref(true);
const isSubmitting = ref(false);
const fetchError = ref<string | null>(null);

const loadProject = async () => {
  isLoading.value = true;
  fetchError.value = null;
  try {
    const data = await projectsStore.fetchProjectById(projectId);
    project.value = data;
  } catch (err: any) {
    fetchError.value =
      err.response?.data?.message || 'Não foi possível carregar o projeto para edição.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadProject();
});

const handleUpdate = async (payload: CreateProjectPayload) => {
  isSubmitting.value = true;
  try {
    await projectsStore.updateProject(projectId, payload);
    toastStore.success('Projeto atualizado com sucesso!');
    router.push('/admin/dashboard');
  } catch (err: any) {
    toastStore.error(
      err.response?.data?.message || 'Falha ao atualizar o projeto.'
    );
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  router.push('/admin/dashboard');
};
</script>

<template>
  <AdminLayout>
    <div class="space-y-8 max-w-4xl mx-auto">
      <!-- Breadcrumb & Back Link -->
      <div>
        <RouterLink
          to="/admin/dashboard"
          class="inline-flex items-center gap-2 text-xs font-semibold text-[#94a3b8] hover:text-[#00ff87] transition group"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar para listagem de projetos
        </RouterLink>
      </div>

      <!-- Header -->
      <div class="border-b border-white/5 pb-6">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-[#00ff87]/10 border border-[#00ff87]/30 flex items-center justify-center text-[#00ff87]"
          >
            <Edit3 class="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] tracking-tight">
              Editar Projeto
            </h1>
            <p class="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
              Atualize as informações, URLs e ordem de exibição do projeto.
            </p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="p-8 bg-[#0e1411] border border-white/5 rounded-2xl">
        <SkeletonLoader type="text" :count="8" />
      </div>

      <!-- Error State -->
      <div
        v-else-if="fetchError"
        class="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center space-y-4 max-w-md mx-auto"
      >
        <AlertCircle class="w-10 h-10 text-red-400 mx-auto" />
        <h3 class="text-lg font-bold text-white">Projeto não encontrado</h3>
        <p class="text-sm text-red-300">{{ fetchError }}</p>
        <BaseButton variant="outline" size="sm" to="/admin/dashboard">
          Voltar ao Dashboard
        </BaseButton>
      </div>

      <!-- Form -->
      <ProjectForm
        v-else
        :initial-data="project"
        submit-button-text="Salvar Alterações"
        :loading="isSubmitting"
        @submit="handleUpdate"
        @cancel="handleCancel"
      />
    </div>
  </AdminLayout>
</template>
