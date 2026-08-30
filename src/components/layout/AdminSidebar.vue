<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import {
  LayoutDashboard,
  PlusCircle,
  ExternalLink,
  LogOut,
  Shield,
  User,
  FileText,
} from 'lucide-vue-next';

defineProps<{
  isMobileOpen?: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/admin/login');
};
</script>

<template>
  <aside
    class="w-64 bg-[#0e1411] border-r border-white/5 flex flex-col justify-between h-full min-h-screen p-5 shrink-0"
  >
    <div class="space-y-6">
      <!-- Admin Header / Logo -->
      <div class="flex items-center gap-3 px-2 py-1">
        <div
          class="w-9 h-9 rounded-lg bg-[#00ff87]/10 border border-[#00ff87]/30 flex items-center justify-center text-[#00ff87] shadow-[0_0_15px_rgba(0,255,135,0.2)]"
        >
          <Shield class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-white tracking-tight">
            Painel Admin
          </h2>
          <p class="text-[11px] text-[#00ff87]">Sistema de Gerenciamento</p>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="space-y-1.5">
        <RouterLink
          to="/admin/dashboard"
          @click="emit('close')"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition duration-150"
          :class="[
            route.path === '/admin/dashboard'
              ? 'bg-[#00ff87]/15 text-[#00ff87] border border-[#00ff87]/30 font-semibold shadow-[0_0_12px_rgba(0,255,135,0.15)]'
              : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/5',
          ]"
        >
          <LayoutDashboard class="w-4 h-4" />
          Projetos Cadastrados
        </RouterLink>

        <RouterLink
          to="/admin/projects/novo"
          @click="emit('close')"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition duration-150"
          :class="[
            route.path === '/admin/projects/novo'
              ? 'bg-[#00ff87]/15 text-[#00ff87] border border-[#00ff87]/30 font-semibold shadow-[0_0_12px_rgba(0,255,135,0.15)]'
              : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/5',
          ]"
        >
          <PlusCircle class="w-4 h-4" />
          Novo Projeto
        </RouterLink>

        <RouterLink
          to="/admin/conteudo"
          @click="emit('close')"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition duration-150"
          :class="[
            route.path === '/admin/conteudo'
              ? 'bg-[#00ff87]/15 text-[#00ff87] border border-[#00ff87]/30 font-semibold shadow-[0_0_12px_rgba(0,255,135,0.15)]'
              : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/5',
          ]"
        >
          <FileText class="w-4 h-4" />
          Editar Portifólio
        </RouterLink>
      </nav>

      <hr class="border-white/5" />

      <!-- Public Site Link -->
      <div>
        <RouterLink
          to="/"
          class="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-[#94a3b8] hover:text-[#00ff87] hover:bg-white/5 transition"
        >
          <span class="flex items-center gap-2">
            <ExternalLink class="w-3.5 h-3.5" />
            Ver Site Público
          </span>
        </RouterLink>
      </div>
    </div>

    <!-- Bottom User Info & Logout -->
    <div class="pt-4 border-t border-white/5 space-y-3">
      <div class="flex items-center gap-3 px-2">
        <div
          class="w-8 h-8 rounded-full bg-[#151d19] border border-white/10 flex items-center justify-center text-[#94a3b8]"
        >
          <User class="w-4 h-4" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-semibold text-[#f8fafc] truncate">
            {{ authStore.user?.email || 'Administrador' }}
          </p>
          <p class="text-[10px] text-[#64748b]">Sessão Ativa</p>
        </div>
      </div>

      <button
        @click="handleLogout"
        class="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition duration-200"
      >
        <LogOut class="w-3.5 h-3.5" />
        Encerrar Sessão
      </button>
    </div>
  </aside>
</template>
