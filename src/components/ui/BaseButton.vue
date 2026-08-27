<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { Loader2 } from 'lucide-vue-next';

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  to?: string | object;
  href?: string;
  target?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  loading: false,
  disabled: false,
});

const isLink = computed(() => !!props.to || !!props.href);

const baseClasses =
  'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#060908] disabled:opacity-50 disabled:cursor-not-allowed';

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-xs gap-1.5';
    case 'lg':
      return 'px-6 py-3 text-base gap-3';
    case 'md':
    default:
      return 'px-4 py-2 text-sm gap-2';
  }
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-[#00ff87] text-[#060908] font-semibold hover:bg-[#34d399] shadow-[0_0_20px_rgba(0,255,135,0.25)] hover:shadow-[0_0_28px_rgba(0,255,135,0.4)] focus:ring-[#00ff87] active:scale-[0.98]';
    case 'secondary':
      return 'bg-[#151d19] text-[#f8fafc] hover:bg-[#1f2b25] border border-white/10 hover:border-[#00ff87]/30 focus:ring-[#00ff87]/50 active:scale-[0.98]';
    case 'outline':
      return 'bg-transparent text-[#00ff87] border border-[#00ff87]/40 hover:border-[#00ff87] hover:bg-[#00ff87]/10 focus:ring-[#00ff87] active:scale-[0.98]';
    case 'danger':
      return 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white focus:ring-red-500 active:scale-[0.98]';
    case 'ghost':
      return 'bg-transparent text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/5 focus:ring-white/20';
    default:
      return '';
  }
});
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    :class="[baseClasses, sizeClasses, variantClasses]"
  >
    <Loader2 v-if="loading" class="w-4 h-4 animate-spin shrink-0" />
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </RouterLink>

  <a
    v-else-if="href"
    :href="href"
    :target="target || '_blank'"
    rel="noopener noreferrer"
    :class="[baseClasses, sizeClasses, variantClasses]"
  >
    <Loader2 v-if="loading" class="w-4 h-4 animate-spin shrink-0" />
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </a>

  <button
    v-else
    :type="type"
    :disabled="disabled || loading"
    :class="[baseClasses, sizeClasses, variantClasses]"
  >
    <Loader2 v-if="loading" class="w-4 h-4 animate-spin shrink-0" />
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </button>
</template>
