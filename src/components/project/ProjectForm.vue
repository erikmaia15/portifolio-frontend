<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { Project, CreateProjectPayload } from '@/types/project';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import {
  Sparkles,
  Link,
  Image as ImageIcon,
  Save,
  ArrowLeft,
  ImageOff,
} from 'lucide-vue-next';

interface Props {
  initialData?: Project | null;
  loading?: boolean;
  submitButtonText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  initialData: null,
  loading: false,
  submitButtonText: 'Salvar Projeto',
});

const emit = defineEmits<{
  submit: [data: CreateProjectPayload];
  cancel: [];
}>();

const form = reactive<CreateProjectPayload>({
  name: '',
  description: '',
  imageUrl: '',
  projectUrl: '',
  order: 0,
});

const errors = reactive({
  name: '',
  description: '',
  imageUrl: '',
  projectUrl: '',
  order: '',
});

const imagePreviewError = ref(false);

const populateForm = (data: Project | null) => {
  if (data) {
    form.name = data.name || '';
    form.description = data.description || '';
    form.imageUrl = data.imageUrl || '';
    form.projectUrl = data.projectUrl || '';
    form.order = data.order ?? 0;
  }
};

watch(
  () => props.initialData,
  (newData) => {
    populateForm(newData);
  },
  { immediate: true }
);

watch(
  () => form.imageUrl,
  () => {
    imagePreviewError.value = false;
  }
);

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const validate = (): boolean => {
  let valid = true;
  errors.name = '';
  errors.description = '';
  errors.imageUrl = '';
  errors.projectUrl = '';

  if (!form.name.trim()) {
    errors.name = 'O nome do projeto é obrigatório.';
    valid = false;
  }

  if (!form.description.trim()) {
    errors.description = 'A descrição do projeto é obrigatória.';
    valid = false;
  }

  if (!form.imageUrl.trim()) {
    errors.imageUrl = 'A URL da imagem é obrigatória.';
    valid = false;
  } else if (!isValidUrl(form.imageUrl)) {
    errors.imageUrl = 'Informe uma URL válida (ex: https://dominio.com/img.jpg)';
    valid = false;
  }

  if (!form.projectUrl.trim()) {
    errors.projectUrl = 'A URL do projeto é obrigatória.';
    valid = false;
  } else if (!isValidUrl(form.projectUrl)) {
    errors.projectUrl = 'Informe uma URL válida (ex: https://github.com/usuario/repo)';
    valid = false;
  }

  return valid;
};

const handleSubmit = () => {
  if (!validate()) return;

  emit('submit', {
    name: form.name.trim(),
    description: form.description.trim(),
    imageUrl: form.imageUrl.trim(),
    projectUrl: form.projectUrl.trim(),
    order: Number(form.order) || 0,
  });
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form Inputs Column (2 cols) -->
      <div class="lg:col-span-2 space-y-6 bg-[#0e1411] border border-white/5 p-6 sm:p-8 rounded-2xl">
        <h3 class="text-base font-bold text-white border-b border-white/5 pb-4 flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-[#00ff87]" />
          Informações Principais
        </h3>

        <!-- Nome do Projeto -->
        <BaseInput
          v-model="form.name"
          label="Nome do Projeto"
          placeholder="Ex: Plataforma de E-commerce Next.js"
          :error="errors.name"
          required
        />

        <!-- Descrição -->
        <div class="space-y-1.5 text-left">
          <label class="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
            Descrição Detalhada
            <span class="text-[#00ff87] ml-0.5">*</span>
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            placeholder="Descreva as tecnologias utilizadas, arquitetura, desafios e propósitos do projeto..."
            :class="[
              'block w-full rounded-lg bg-[#0e1411] text-[#f8fafc] text-sm placeholder-[#475569] p-3.5 transition-all duration-200 focus:outline-none border',
              errors.description
                ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                : 'border-white/10 hover:border-white/20 focus:border-[#00ff87] focus:ring-2 focus:ring-[#00ff87]/20 focus:shadow-[0_0_15px_rgba(0,255,135,0.15)]',
            ]"
            required
          />
          <p v-if="errors.description" class="text-xs text-red-400 font-medium">
            {{ errors.description }}
          </p>
        </div>

        <!-- URLs -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInput
            v-model="form.imageUrl"
            label="URL da Imagem / Thumbnail"
            type="url"
            placeholder="https://exemplo.com/preview.png"
            :error="errors.imageUrl"
            required
          >
            <template #prefix>
              <ImageIcon class="w-4 h-4" />
            </template>
          </BaseInput>

          <BaseInput
            v-model="form.projectUrl"
            label="URL do Projeto / Deploy / Repo"
            type="url"
            placeholder="https://github.com/..."
            :error="errors.projectUrl"
            required
          >
            <template #prefix>
              <Link class="w-4 h-4" />
            </template>
          </BaseInput>
        </div>

        <!-- Ordem de Exibição -->
        <div class="max-w-xs">
          <BaseInput
            v-model="form.order"
            label="Ordem de Exibição (Prioridade)"
            type="number"
            placeholder="0"
            hint="Valores menores aparecem primeiro (ex: 0, 1, 2...)"
          />
        </div>
      </div>

      <!-- Live Preview Column (1 col) -->
      <div class="space-y-4">
        <h3 class="text-sm font-semibold uppercase tracking-wider text-[#94a3b8]">
          Prévia em Tempo Real
        </h3>

        <div class="bg-[#0e1411] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <!-- Thumbnail preview -->
          <div class="w-full h-44 bg-[#151d19] flex items-center justify-center relative overflow-hidden">
            <img
              v-if="form.imageUrl && !imagePreviewError"
              :src="form.imageUrl"
              :alt="form.name || 'Prévia'"
              @error="imagePreviewError = true"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="text-center p-4 text-[#64748b] flex flex-col items-center gap-1.5"
            >
              <ImageOff class="w-8 h-8 text-[#475569]" />
              <span class="text-xs">
                {{ form.imageUrl ? 'URL da imagem inválida ou inacessível' : 'Nenhuma imagem informada' }}
              </span>
            </div>

            <div
              class="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#060908]/80 text-[#00ff87] text-[10px] font-bold border border-[#00ff87]/30 backdrop-blur-sm"
            >
              Ordem: {{ form.order || 0 }}
            </div>
          </div>

          <!-- Content preview -->
          <div class="p-5 space-y-2">
            <h4 class="font-bold text-[#f8fafc] text-base truncate">
              {{ form.name || 'Título do Projeto' }}
            </h4>
            <p class="text-xs text-[#94a3b8] line-clamp-3 leading-relaxed">
              {{ form.description || 'Aqui aparecerá a descrição completa do projeto assim que você preencher os campos ao lado.' }}
            </p>

            <div class="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#00ff87]">
              <span class="truncate max-w-[200px]">
                {{ form.projectUrl || 'https://exemplo.com' }}
              </span>
              <Link class="w-3.5 h-3.5 shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Footer Actions -->
    <div class="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
      <BaseButton
        variant="ghost"
        type="button"
        @click="emit('cancel')"
        :disabled="loading"
      >
        <template #icon-left>
          <ArrowLeft class="w-4 h-4" />
        </template>
        Cancelar
      </BaseButton>

      <BaseButton
        variant="primary"
        type="submit"
        :loading="loading"
      >
        <template #icon-left>
          <Save class="w-4 h-4" />
        </template>
        {{ submitButtonText }}
      </BaseButton>
    </div>
  </form>
</template>
