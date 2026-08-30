<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useSiteContentStore } from '@/stores/site-content.store';
import { useToastStore } from '@/stores/toast.store';
import axios from 'axios';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { FileText, Save, Home, User as UserIcon, UploadCloud, ImageOff } from 'lucide-vue-next';

const auth = useAuthStore();
const contentStore = useSiteContentStore();
const toastStore = useToastStore();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const homeForm = ref({
  eyebrow: '',
  headline: '',
  description: ''
});

const aboutForm = ref({
  name: '',
  bioRaw: '',
  photoUrl: ''
});

const isLoadingHome = ref(false);
const isLoadingAbout = ref(false);
const isUploading = ref(false);

const textareaBaseClass = "block w-full rounded-lg bg-[#0e1411] text-[#f8fafc] text-sm placeholder-[#475569] p-3.5 transition-all duration-200 focus:outline-none border border-white/10 hover:border-white/20 focus:border-[#00ff87] focus:ring-2 focus:ring-[#00ff87]/20 focus:shadow-[0_0_15px_rgba(0,255,135,0.15)]";

onMounted(async () => {
  try {
    await contentStore.fetchContent();
    if (contentStore.homeContent) {
      homeForm.value.eyebrow = contentStore.homeContent.eyebrow || '';
      homeForm.value.headline = contentStore.homeContent.headline || '';
      homeForm.value.description = contentStore.homeContent.description || '';
    }
    
    if (contentStore.aboutContent) {
      aboutForm.value.name = contentStore.aboutContent.name || '';
      aboutForm.value.photoUrl = contentStore.aboutContent.photoUrl || '';
      aboutForm.value.bioRaw = (contentStore.aboutContent.bioParagraphs || []).join('\n\n');
    }
  } catch (error) {
    toastStore.error('Erro ao carregar conteúdo do site.');
  }
});

const saveHome = async () => {
  isLoadingHome.value = true;
  try {
    await axios.patch(`${API_URL}/site-content/home`, homeForm.value, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    toastStore.success('Conteúdo da Home salvo com sucesso!');
  } catch (e: any) {
    toastStore.error(e.response?.data?.message || 'Erro ao salvar conteúdo da Home.');
  } finally {
    isLoadingHome.value = false;
  }
};

const saveAbout = async () => {
  isLoadingAbout.value = true;
  try {
    const payload = {
      name: aboutForm.value.name,
      bioParagraphs: aboutForm.value.bioRaw.split('\n\n').filter((p: string) => p.trim() !== '')
    };
    await axios.patch(`${API_URL}/site-content/about`, payload, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    toastStore.success('Conteúdo do Sobre salvo com sucesso!');
  } catch (e: any) {
    toastStore.error(e.response?.data?.message || 'Erro ao salvar conteúdo do Sobre.');
  } finally {
    isLoadingAbout.value = false;
  }
};

const uploadPhoto = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || !target.files[0]) return;
  
  isUploading.value = true;
  const formData = new FormData();
  formData.append('file', target.files[0]);
  
  try {
    const res = await axios.post(`${API_URL}/site-content/photo`, formData, {
      headers: { 
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    aboutForm.value.photoUrl = res.data.photoUrl;
    toastStore.success('Foto enviada com sucesso!');
  } catch (e: any) {
    toastStore.error(e.response?.data?.message || 'Erro ao fazer upload da foto.');
  } finally {
    isUploading.value = false;
    target.value = '';
  }
};
</script>

<template>
  <AdminLayout>
    <div class="space-y-8 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="border-b border-white/5 pb-6">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-[#00ff87]/10 border border-[#00ff87]/30 flex items-center justify-center text-[#00ff87]"
          >
            <FileText class="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] tracking-tight">
              Conteúdo do Site
            </h1>
            <p class="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
              Edite as informações exibidas na página inicial e na seção sobre você.
            </p>
          </div>
        </div>
      </div>

      <!-- HOME SECTION -->
      <section class="bg-[#0e1411] border border-white/5 p-6 sm:p-8 rounded-2xl space-y-6">
        <div class="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <Home class="w-5 h-5 text-[#00ff87]" />
            Seção Home (Hero)
          </h3>
          <BaseButton
            variant="primary"
            size="sm"
            @click="saveHome"
            :loading="isLoadingHome"
          >
            <template #icon-left>
              <Save class="w-4 h-4" />
            </template>
            Salvar Home
          </BaseButton>
        </div>
        
        <div class="space-y-6">
          <BaseInput
            v-model="homeForm.eyebrow"
            label="Eyebrow (Texto acima do título)"
            placeholder="Ex: Olá, eu sou..."
          />
          
          <div class="space-y-1.5 text-left">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
              Headline (Título Principal)
            </label>
            <textarea
              v-model="homeForm.headline"
              rows="2"
              placeholder="Ex: Desenvolvedor Full Stack especializado em Vue e Node"
              :class="textareaBaseClass"
            ></textarea>
          </div>
          
          <div class="space-y-1.5 text-left">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
              Descrição
            </label>
            <textarea
              v-model="homeForm.description"
              rows="3"
              placeholder="Descreva brevemente seu perfil ou objetivo..."
              :class="textareaBaseClass"
            ></textarea>
          </div>
        </div>
      </section>

      <!-- ABOUT SECTION -->
      <section class="bg-[#0e1411] border border-white/5 p-6 sm:p-8 rounded-2xl space-y-6">
        <div class="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <UserIcon class="w-5 h-5 text-[#00ff87]" />
            Seção Sobre (Bio)
          </h3>
          <BaseButton
            variant="primary"
            size="sm"
            @click="saveAbout"
            :loading="isLoadingAbout"
          >
            <template #icon-left>
              <Save class="w-4 h-4" />
            </template>
            Salvar Sobre
          </BaseButton>
        </div>

        <div class="space-y-6">
          <BaseInput
            v-model="aboutForm.name"
            label="Seu Nome"
            placeholder="Ex: Erik Maia"
          />
          
          <div class="space-y-1.5 text-left">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
              Biografia <span class="text-[#64748b] normal-case font-normal">(separar parágrafos com quebra de linha dupla)</span>
            </label>
            <textarea
              v-model="aboutForm.bioRaw"
              rows="6"
              placeholder="Escreva sobre sua jornada, habilidades e interesses..."
              :class="textareaBaseClass"
            ></textarea>
          </div>
          
          <div class="space-y-3">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
              Foto de Perfil
            </label>
            
            <div class="flex items-center gap-6">
              <div
                class="w-24 h-24 rounded-full bg-[#151d19] border-2 border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-lg"
              >
                <img 
                  v-if="aboutForm.photoUrl" 
                  :src="aboutForm.photoUrl.startsWith('http') ? aboutForm.photoUrl : API_URL + aboutForm.photoUrl" 
                  class="w-full h-full object-cover" 
                  alt="Foto de perfil"
                  @error="(e: any) => e.target.style.display = 'none'"
                />
                <ImageOff v-else class="w-8 h-8 text-[#475569]" />
              </div>
              
              <div class="space-y-2">
                <label 
                  class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors"
                  :class="isUploading ? 'opacity-50 cursor-not-allowed' : ''"
                >
                  <UploadCloud class="w-4 h-4 text-[#00ff87]" />
                  {{ isUploading ? 'Enviando...' : 'Escolher nova foto' }}
                  <input 
                    type="file" 
                    @change="uploadPhoto" 
                    class="hidden" 
                    accept="image/*"
                    :disabled="isUploading"
                  />
                </label>
                <p class="text-[11px] text-[#64748b]">
                  Recomendado: Imagem quadrada (1:1), máx 2MB. Jpeg ou Png.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </AdminLayout>
</template>
