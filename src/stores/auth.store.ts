import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';
import type { AuthUser, LoginResponse } from '@/types/project';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<AuthUser | null>(null);
  const isLoading = ref(false);
  const isInitializing = ref(true);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  async function login(email: string, password: string): Promise<boolean> {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
      token.value = data.access_token;
      localStorage.setItem('token', data.access_token);
      await fetchMe();
      return true;
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        'Falha no login. Verifique suas credenciais de acesso.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchMe(): Promise<AuthUser | null> {
    if (!token.value) {
      user.value = null;
      return null;
    }
    try {
      const { data } = await api.get<AuthUser>('/auth/me');
      user.value = data;
      return data;
    } catch {
      // If fetching user profile fails, invalidate token
      logout();
      return null;
    }
  }

  async function checkAuth(): Promise<boolean> {
    isInitializing.value = true;
    try {
      if (token.value) {
        const u = await fetchMe();
        return !!u;
      }
      return false;
    } finally {
      isInitializing.value = false;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    error.value = null;
    localStorage.removeItem('token');
  }

  return {
    token,
    user,
    isLoading,
    isInitializing,
    error,
    isAuthenticated,
    login,
    fetchMe,
    checkAuth,
    logout,
  };
});
