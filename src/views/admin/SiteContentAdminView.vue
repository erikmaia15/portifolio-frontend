<template>
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-12">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">Conteúdo do Site</h1>
      <button @click="saveHome" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
        Salvar Home
      </button>
    </div>

    <!-- HOME SECTION -->
    <section class="space-y-6 bg-gray-50 p-6 rounded-lg border">
      <h2 class="text-2xl font-semibold">Home (Hero)</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Eyebrow</label>
          <input v-model="homeForm.eyebrow" class="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Headline</label>
          <textarea v-model="homeForm.headline" rows="2" class="w-full px-3 py-2 border rounded-md"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Descrição</label>
          <textarea v-model="homeForm.description" rows="3" class="w-full px-3 py-2 border rounded-md"></textarea>
        </div>
      </div>
    </section>

    <!-- ABOUT SECTION -->
    <section class="space-y-6 bg-gray-50 p-6 rounded-lg border">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold">Sobre (Bio)</h2>
        <button @click="saveAbout" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
          Salvar Sobre
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Nome</label>
          <input v-model="aboutForm.name" class="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Bio (separar parágrafos com quebra de linha dupla)</label>
          <textarea v-model="aboutForm.bioRaw" rows="6" class="w-full px-3 py-2 border rounded-md"></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Foto de Perfil</label>
          <div class="flex items-center gap-4">
            <img v-if="aboutForm.photoUrl" :src="'http://localhost:3000' + aboutForm.photoUrl" class="w-16 h-16 rounded-full object-cover" />
            <input type="file" @change="uploadPhoto" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useSiteContentStore } from '@/stores/site-content.store';
import axios from 'axios';

const auth = useAuthStore();
const contentStore = useSiteContentStore();
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

onMounted(async () => {
  await contentStore.fetchContent();
  if (contentStore.homeContent) {
    homeForm.value.eyebrow = contentStore.homeContent.eyebrow;
    homeForm.value.headline = contentStore.homeContent.headline;
    homeForm.value.description = contentStore.homeContent.description;
  }
  
  if (contentStore.aboutContent) {
    aboutForm.value.name = contentStore.aboutContent.name;
    aboutForm.value.photoUrl = contentStore.aboutContent.photoUrl || '';
    aboutForm.value.bioRaw = (contentStore.aboutContent.bioParagraphs || []).join('\n\n');
  }
});

const saveHome = async () => {
  try {
    await axios.patch(`${API_URL}/site-content/home`, homeForm.value, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    alert('Home salva com sucesso!');
  } catch (e) {
    alert('Erro ao salvar home');
  }
};

const saveAbout = async () => {
  try {
    const payload = {
      name: aboutForm.value.name,
      bioParagraphs: aboutForm.value.bioRaw.split('\n\n').filter(p => p.trim() !== '')
    };
    await axios.patch(`${API_URL}/site-content/about`, payload, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    alert('Sobre salvo com sucesso!');
  } catch (e) {
    alert('Erro ao salvar sobre');
  }
};

const uploadPhoto = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || !target.files[0]) return;
  
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
    alert('Foto enviada!');
  } catch (e) {
    alert('Erro no upload');
  }
};
</script>
