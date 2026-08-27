<script setup lang="ts">
import { RouterLink } from 'vue-router';
import BaseButton from '@/components/ui/BaseButton.vue';
import { Home, Compass } from 'lucide-vue-next';
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center p-4 text-center">
    <div class="space-y-6 max-w-md">
      <div
        class="w-16 h-16 rounded-2xl bg-[#00ff87]/10 border border-[#00ff87]/30 flex items-center justify-center text-[#00ff87] mx-auto shadow-[0_0_25px_rgba(0,255,135,0.2)]"
      >
        <Compass class="w-8 h-8 animate-spin-slow" />
      </div>

      <div class="space-y-2">
        <span class="text-xs font-mono font-bold text-[#00ff87] uppercase tracking-widest">
          Erro 404
        </span>
        <h1 class="text-3xl font-extrabold text-[#f8fafc]">
          Página não encontrada
        </h1>
        <p class="text-sm text-[#94a3b8]">
          A página que você está procurando não existe ou foi movida.
        </p>
      </div>

      <div class="pt-2">
        <BaseButton variant="primary" to="/">
          <template #icon-left>
            <Home class="w-4 h-4" />
          </template>
          Voltar para o Início
        </BaseButton>
      </div>
    </div>
  </div>
</template>
