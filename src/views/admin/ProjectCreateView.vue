<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import ProjectForm from '@/components/project/ProjectForm.vue';
import { useProjectsStore } from '@/stores/projects.store';
import { useToastStore } from '@/stores/toast.store';
import type { CreateProjectPayload } from '@/types/project';
import { ArrowLeft, PlusCircle } from 'lucide-vue-next';

const router = useRouter();
const projectsStore = useProjectsStore();
const toastStore = useToastStore();
const isSubmitting = ref(false);

const handleCreate = async (payload: CreateProjectPayload) => {
  isSubmitting.value = true;
  try {
    await projectsStore.createProject(payload);
    toastStore.success('Projeto criado com sucesso!');
    router.push('/admin/dashboard');
  } catch (err: any) {
    toastStore.error(
      err.response?.data?.message || 'Falha ao cadastrar o projeto.'
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
            <PlusCircle class="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] tracking-tight">
              Novo Projeto
            </h1>
            <p class="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
              Cadastre um novo projeto para exibir em destaque na galeria pública.
            </p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <ProjectForm
        submit-button-text="Criar Projeto"
        :loading="isSubmitting"
        @submit="handleCreate"
        @cancel="handleCancel"
      />
    </div>
  </AdminLayout>
</template>
