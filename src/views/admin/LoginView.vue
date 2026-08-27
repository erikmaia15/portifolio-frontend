<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { Lock, Mail, Shield, ArrowLeft, KeyRound } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();

const email = ref('');
const password = ref('');
const localError = ref('');

const handleLogin = async () => {
  localError.value = '';

  if (!email.value || !password.value) {
    localError.value = 'Por favor, preencha todos os campos.';
    return;
  }

  try {
    await authStore.login(email.value.trim(), password.value);
    toastStore.success('Login efetuado com sucesso!', 'Bem-vindo');
    router.push('/admin/dashboard');
  } catch (err: any) {
    localError.value =
      err.response?.data?.message ||
      'Credenciais inválidas. Verifique seu e-mail e senha.';
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#060908] flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Ambient Green Glow -->
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00ff87]/10 rounded-full blur-3xl pointer-events-none"
    />

    <div class="w-full max-w-md space-y-6 relative z-10">
      <!-- Back to site link -->
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 text-xs font-semibold text-[#94a3b8] hover:text-[#00ff87] transition group"
      >
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Voltar para o site público
      </RouterLink>

      <!-- Card -->
      <div class="bg-[#0e1411] border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
        <!-- Logo & Title -->
        <div class="text-center space-y-2">
          <div
            class="w-12 h-12 rounded-xl bg-[#00ff87]/10 border border-[#00ff87]/30 flex items-center justify-center text-[#00ff87] mx-auto shadow-[0_0_20px_rgba(0,255,135,0.2)]"
          >
            <Shield class="w-6 h-6" />
          </div>
          <h1 class="text-2xl font-extrabold text-[#f8fafc] tracking-tight">
            Acesso Administrativo
          </h1>
          <p class="text-xs text-[#94a3b8]">
            Autentique-se com suas credenciais para gerenciar os projetos.
          </p>
        </div>

        <!-- Error Feedback -->
        <div
          v-if="localError"
          class="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-medium leading-relaxed"
        >
          {{ localError }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <BaseInput
            v-model="email"
            label="E-mail"
            type="email"
            placeholder="admin@email.com"
            autocomplete="email"
            required
          >
            <template #prefix>
              <Mail class="w-4 h-4" />
            </template>
          </BaseInput>

          <BaseInput
            v-model="password"
            label="Senha"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            required
          >
            <template #prefix>
              <Lock class="w-4 h-4" />
            </template>
          </BaseInput>

          <div class="pt-2">
            <BaseButton
              variant="primary"
              size="lg"
              type="submit"
              class="w-full"
              :loading="authStore.isLoading"
            >
              <template #icon-left>
                <KeyRound class="w-4 h-4" />
              </template>
              Entrar no Painel
            </BaseButton>
          </div>
        </form>
      </div>

      <p class="text-center text-xs text-[#64748b]">
        Área restrita e protegida por autenticação JWT Bearer.
      </p>
    </div>
  </div>
</template>
