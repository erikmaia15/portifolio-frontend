<script setup lang="ts">
interface Props {
  type?: 'card' | 'table-row' | 'text' | 'image';
  count?: number;
}

withDefaults(defineProps<Props>(), {
  type: 'card',
  count: 1,
});
</script>

<template>
  <div v-if="type === 'card'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="n in count"
      :key="n"
      class="bg-[#0e1411] border border-white/5 rounded-2xl overflow-hidden animate-pulse"
    >
      <div class="h-52 bg-[#151d19]" />
      <div class="p-6 space-y-4">
        <div class="h-5 bg-[#151d19] rounded-md w-2/3" />
        <div class="space-y-2">
          <div class="h-3.5 bg-[#151d19] rounded w-full" />
          <div class="h-3.5 bg-[#151d19] rounded w-4/5" />
        </div>
        <div class="pt-2 flex justify-between items-center">
          <div class="h-4 bg-[#151d19] rounded w-20" />
          <div class="h-4 bg-[#151d19] rounded w-6" />
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="type === 'table-row'" class="space-y-3">
    <div
      v-for="n in count"
      :key="n"
      class="flex items-center justify-between p-4 bg-[#0e1411] border border-white/5 rounded-xl animate-pulse"
    >
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-[#151d19] rounded-lg" />
        <div class="space-y-2">
          <div class="h-4 bg-[#151d19] rounded w-36" />
          <div class="h-3 bg-[#151d19] rounded w-52" />
        </div>
      </div>
      <div class="flex gap-2">
        <div class="w-8 h-8 bg-[#151d19] rounded" />
        <div class="w-8 h-8 bg-[#151d19] rounded" />
      </div>
    </div>
  </div>

  <div v-else class="space-y-2 animate-pulse">
    <div v-for="n in count" :key="n" class="h-4 bg-[#151d19] rounded w-full" />
  </div>
</template>
