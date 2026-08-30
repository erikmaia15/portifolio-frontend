<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  href?: string
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
})

defineEmits(['click'])

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-body font-semibold rounded-md transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

const variantClasses = computed(() => {
  const variants: Record<string, string> = {
    primary:
      'bg-[--accent] text-[--canvas] hover:bg-[--accent-hover] active:scale-[0.98]',
    secondary:
      'bg-[--surface] text-[--text-primary] border border-[--border-subtle] hover:border-[--border-accent] hover:text-[--accent] active:scale-[0.98]',
    ghost:
      'text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--surface]',
    outline:
      'border border-[--border-accent] text-[--accent] hover:bg-[--accent-dim] active:scale-[0.98]',
    danger:
      'bg-[--danger] text-white hover:bg-[--danger-hover] active:scale-[0.98]',
  }
  return variants[props.variant] || variants.primary
})

const sizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-sm px-6 py-3',
  }
  return sizes[props.size] || sizes.md
})

const tag = computed(() => {
  if (props.to) return RouterLink
  if (props.href) return 'a'
  return 'button'
})

const linkProps = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) {
    const isExternal =
      props.href.startsWith('http') || props.href.startsWith('mailto')
    return {
      href: props.href,
      ...(isExternal
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {}),
    }
  }
  return { type: props.type, disabled: props.disabled || props.loading }
})
</script>

<template>
  <component
    :is="tag"
    v-bind="linkProps"
    :class="[baseClasses, variantClasses, sizeClasses]"
    @click="$emit('click', $event)"
  >
    <span
      v-if="loading"
      class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
    />
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </component>
</template>
