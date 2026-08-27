<script setup lang="ts">
import { useToastStore } from '@/stores/toast.store';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-vue-next';

const toastStore = useToastStore();
</script>

<template>
  <div
    class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
  >
    <TransitionGroup
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-4 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md bg-[#0e1411]/95"
        :class="{
          'border-[#00ff87]/40 shadow-[0_0_20px_rgba(0,255,135,0.15)]':
            toast.type === 'success',
          'border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.15)]':
            toast.type === 'error',
          'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]':
            toast.type === 'warning',
          'border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]':
            toast.type === 'info',
        }"
      >
        <div class="shrink-0 mt-0.5">
          <CheckCircle2
            v-if="toast.type === 'success'"
            class="w-5 h-5 text-[#00ff87]"
          />
          <AlertCircle
            v-else-if="toast.type === 'error'"
            class="w-5 h-5 text-red-400"
          />
          <AlertTriangle
            v-else-if="toast.type === 'warning'"
            class="w-5 h-5 text-amber-400"
          />
          <Info v-else class="w-5 h-5 text-blue-400" />
        </div>

        <div class="flex-1 min-w-0">
          <h4
            v-if="toast.title"
            class="text-xs font-bold uppercase tracking-wider text-[#f8fafc]"
          >
            {{ toast.title }}
          </h4>
          <p class="text-sm text-[#cbd5e1] leading-snug">
            {{ toast.message }}
          </p>
        </div>

        <button
          @click="toastStore.remove(toast.id)"
          class="shrink-0 text-[#64748b] hover:text-[#f8fafc] p-0.5 rounded transition"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
