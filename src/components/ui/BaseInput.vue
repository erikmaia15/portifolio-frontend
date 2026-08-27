<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue?: string | number | null;
  label?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  autocomplete?: string;
}


const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  required: false,
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const inputId = computed(
  () => props.id || `input-${Math.random().toString(36).substring(2, 9)}`
);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="w-full space-y-1.5 text-left">
    <label
      v-if="label"
      :for="inputId"
      class="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8]"
    >
      {{ label }}
      <span v-if="required" class="text-[#00ff87] ml-0.5">*</span>
    </label>

    <div class="relative rounded-lg shadow-sm">
      <div
        v-if="$slots.prefix"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#64748b]"
      >
        <slot name="prefix" />
      </div>

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        @input="onInput"
        :class="[
          'block w-full rounded-lg bg-[#0e1411] text-[#f8fafc] text-sm placeholder-[#475569] transition-all duration-200 focus:outline-none',
          'border',
          error
            ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
            : 'border-white/10 hover:border-white/20 focus:border-[#00ff87] focus:ring-2 focus:ring-[#00ff87]/20 focus:shadow-[0_0_15px_rgba(0,255,135,0.15)]',
          $slots.prefix ? 'pl-10' : 'pl-3.5',
          $slots.suffix ? 'pr-10' : 'pr-3.5',
          'py-2.5',
          disabled ? 'opacity-50 cursor-not-allowed bg-[#060908]' : '',
        ]"
      />

      <div
        v-if="$slots.suffix"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-[#64748b]"
      >
        <slot name="suffix" />
      </div>
    </div>

    <p v-if="error" class="text-xs text-red-400 font-medium">
      {{ error }}
    </p>
    <p v-else-if="hint" class="text-xs text-[#64748b]">
      {{ hint }}
    </p>
  </div>
</template>
