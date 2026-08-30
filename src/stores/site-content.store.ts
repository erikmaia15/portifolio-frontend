import { defineStore } from 'pinia';
import axios from 'axios';

// Usar import.meta.env para o Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useSiteContentStore = defineStore('siteContent', {
  state: () => ({
    homeContent: null as any,
    aboutContent: null as any,
    isLoading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchContent() {
      this.isLoading = true;
      this.error = null;
      try {
        const [homeRes, aboutRes] = await Promise.all([
          axios.get(`${API_URL}/site-content/home`),
          axios.get(`${API_URL}/site-content/about`)
        ]);
        this.homeContent = homeRes.data;
        this.aboutContent = aboutRes.data;
      } catch (err: any) {
        this.error = err.message || 'Error fetching content';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    }
  }
});
