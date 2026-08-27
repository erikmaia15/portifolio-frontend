import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';
import type {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
} from '@/types/project';

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([]);
  const currentProject = ref<Project | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const sortedProjects = computed(() => {
    return [...projects.value].sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  });

  const featuredProjects = computed(() => {
    return sortedProjects.value.slice(0, 3);
  });

  async function fetchProjects(): Promise<Project[]> {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<Project[]>('/projects');
      projects.value = data;
      return data;
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        'Não foi possível carregar os projetos no momento.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchProjectById(id: string): Promise<Project> {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<Project>(`/projects/${id}`);
      currentProject.value = data;
      return data;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || 'Projeto não encontrado.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function createProject(payload: CreateProjectPayload): Promise<Project> {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await api.post<Project>('/projects', payload);
      projects.value.push(data);
      return data;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || 'Erro ao criar projeto.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateProject(
    id: string,
    payload: UpdateProjectPayload
  ): Promise<Project> {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await api.patch<Project>(`/projects/${id}`, payload);
      const index = projects.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        projects.value[index] = data;
      }
      if (currentProject.value?.id === id) {
        currentProject.value = data;
      }
      return data;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || 'Erro ao atualizar o projeto.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteProject(id: string): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      await api.delete(`/projects/${id}`);
      projects.value = projects.value.filter((p) => p.id !== id);
      if (currentProject.value?.id === id) {
        currentProject.value = null;
      }
    } catch (err: any) {
      error.value =
        err.response?.data?.message || 'Erro ao remover o projeto.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    projects,
    currentProject,
    isLoading,
    error,
    sortedProjects,
    featuredProjects,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
  };
});
