<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Github, Linkedin, Mail, Heart, Sparkles } from "lucide-vue-next";

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer
    class="bg-[#060908] border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8 mt-auto"
  >
    <div
      class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <div class="flex flex-col items-center md:items-start gap-2">
        <div class="flex items-center gap-2">
          <span class="text-white font-bold text-base tracking-tight">
            erik<span class="text-[#00ff87]">.dev</span>
          </span>
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/20"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-ping" />
            Disponível para novos projetos
          </span>
        </div>
        <p class="text-xs text-[#64748b]">
          Desenvolvimento Full Stack com NestJS, Vue 3, TypeScript e PostgreSQL.
        </p>
      </div>

      <div class="flex items-center gap-4 text-[#94a3b8]">
        <a
          href="https://github.com/erikmaia15"
          target="_blank"
          rel="noopener noreferrer"
          class="w-9 h-9 rounded-lg bg-[#0e1411] border border-white/10 flex items-center justify-center hover:text-[#00ff87] hover:border-[#00ff87]/40 hover:shadow-[0_0_12px_rgba(0,255,135,0.2)] transition"
          aria-label="GitHub"
        >
          <Github class="w-4 h-4" />
        </a>
        <a
          href="https://www.linkedin.com/in/erik-maia-0a326237b"
          target="_blank"
          rel="noopener noreferrer"
          class="w-9 h-9 rounded-lg bg-[#0e1411] border border-white/10 flex items-center justify-center hover:text-[#00ff87] hover:border-[#00ff87]/40 hover:shadow-[0_0_12px_rgba(0,255,135,0.2)] transition"
          aria-label="LinkedIn"
        >
          <Linkedin class="w-4 h-4" />
        </a>
        <a
          href="mailto:erik.maia15oliveira@gmail.com"
          class="w-9 h-9 rounded-lg bg-[#0e1411] border border-white/10 flex items-center justify-center hover:text-[#00ff87] hover:border-[#00ff87]/40 hover:shadow-[0_0_12px_rgba(0,255,135,0.2)] transition"
          aria-label="Email"
        >
          <Mail class="w-4 h-4" />
        </a>
      </div>
    </div>

    <div
      class="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748b] gap-3"
    >
      <p>© {{ currentYear }} Erik. Todos os direitos reservados.</p>
      <div class="flex items-center gap-4">
        <RouterLink to="/admin/login" class="hover:text-[#94a3b8] transition">
          Área Administrativa
        </RouterLink>
      </div>
    </div>
  </footer>
</template>
