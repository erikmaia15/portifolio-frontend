<script setup lang="ts">
import { RouterLink } from 'vue-router';
import BaseButton from '@/components/ui/BaseButton.vue';
import { Home, Compass } from 'lucide-vue-next';
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center p-4 text-center">
    <div class="space-y-6 max-w-md">
      <div
        class="w-16 h-16 rounded-lg bg-[--accent-dim] border border-[--border-accent] flex items-center justify-center text-[--accent] mx-auto"
      >
        <Compass class="w-8 h-8" />
      </div>

      <div class="space-y-2">
        <span class="text-xs font-mono font-medium text-[--accent] uppercase tracking-widest">
          Erro 404
        </span>
        <h1 class="text-3xl font-display font-bold text-[--text-primary]">
          Página não encontrada
        </h1>
        <p class="text-sm font-body text-[--text-secondary]">
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
