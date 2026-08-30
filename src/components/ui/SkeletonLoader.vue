<script setup lang="ts">
interface Props {
  type?: 'card' | 'line' | 'circle' | 'table-row' | 'text'
  count?: number
}

withDefaults(defineProps<Props>(), {
  type: 'card',
  count: 3,
})
</script>

<template>
  <div
    v-if="type === 'card'"
    class="grid grid-cols-1 md:grid-cols-2 gap-6"
  >
    <div
      v-for="i in count"
      :key="i"
      class="bg-[--surface] border border-[--border-subtle] rounded-lg p-6 space-y-4 animate-pulse"
    >
      <div class="h-44 bg-[--surface-elevated] rounded-md" />
      <div class="h-5 bg-[--surface-elevated] rounded w-3/4" />
      <div class="space-y-2">
        <div class="h-3 bg-[--surface-elevated] rounded w-full" />
        <div class="h-3 bg-[--surface-elevated] rounded w-5/6" />
      </div>
      <div class="pt-3 border-t border-[--border-subtle]">
        <div class="h-3 bg-[--surface-elevated] rounded w-24" />
      </div>
    </div>
  </div>

  <div v-else-if="type === 'line'" class="space-y-3">
    <div
      v-for="i in count"
      :key="i"
      class="h-4 bg-[--surface] rounded animate-pulse"
      :style="{ width: `${60 + Math.random() * 30}%` }"
    />
  </div>

  <div v-else-if="type === 'circle'" class="flex gap-4">
    <div
      v-for="i in count"
      :key="i"
      class="w-12 h-12 bg-[--surface] rounded-full animate-pulse"
    />
  </div>
</template>
