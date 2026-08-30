<script setup lang="ts">
import { useToastStore } from '@/stores/toast.store'
import { X, CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-vue-next'

const toastStore = useToastStore()

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const colorMap: Record<string, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  warning: 'border-amber-500/30 bg-amber-500/10',
  info: 'border-[--border-accent] bg-[--accent-dim]',
}

const iconColorMap: Record<string, string> = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  warning: 'text-amber-400',
  info: 'text-[--accent]',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-4"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-4"
      >
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm',
            colorMap[toast.type] || colorMap.info,
          ]"
        >
          <component
            :is="iconMap[toast.type] || iconMap.info"
            :class="['w-5 h-5 shrink-0 mt-0.5', iconColorMap[toast.type] || iconColorMap.info]"
          />
          <div class="flex-1 min-w-0">
            <p v-if="toast.title" class="text-sm font-semibold text-[--text-primary]">
              {{ toast.title }}
            </p>
            <p class="text-sm text-[--text-secondary]">
              {{ toast.message }}
            </p>
          </div>
          <button
            @click="toastStore.remove(toast.id)"
            class="text-[--text-muted] hover:text-[--text-primary] transition-colors shrink-0"
            aria-label="Fechar notificação"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
