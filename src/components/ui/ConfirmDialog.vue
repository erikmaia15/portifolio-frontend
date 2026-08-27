<script setup lang="ts">
import { AlertTriangle, X } from 'lucide-vue-next';
import BaseButton from './BaseButton.vue';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  isDestructive: false,
  loading: false,
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        @click.self="emit('cancel')"
      >
        <div
          class="w-full max-w-md bg-[#0e1411] border border-white/10 rounded-xl p-6 shadow-2xl space-y-4"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div
                :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                  isDestructive
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/20',
                ]"
              >
                <AlertTriangle class="w-5 h-5" />
              </div>
              <h3 class="text-lg font-bold text-[#f8fafc]">
                {{ title }}
              </h3>
            </div>
            <button
              @click="emit('cancel')"
              class="text-[#64748b] hover:text-[#f8fafc] p-1 rounded-lg hover:bg-white/5 transition"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <p class="text-sm text-[#94a3b8] leading-relaxed">
            {{ message }}
          </p>

          <div class="flex items-center justify-end gap-3 pt-2">
            <BaseButton
              variant="ghost"
              size="md"
              @click="emit('cancel')"
              :disabled="loading"
            >
              {{ cancelText }}
            </BaseButton>
            <BaseButton
              :variant="isDestructive ? 'danger' : 'primary'"
              size="md"
              :loading="loading"
              @click="emit('confirm')"
            >
              {{ confirmText }}
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
