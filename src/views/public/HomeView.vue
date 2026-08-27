<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useProjectsStore } from "@/stores/projects.store";
import ProjectGrid from "@/components/project/ProjectGrid.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import {
  ArrowRight,
  Sparkles,
  Terminal,
  Server,
  Layers,
  ShieldCheck,
  Send,
  Github,
  Linkedin,
  Mail,
  CheckCircle2,
  FolderGit2,
} from "lucide-vue-next";

const projectsStore = useProjectsStore();

onMounted(() => {
  projectsStore.fetchProjects().catch(() => {
    // Graceful silent handle, UI shows empty state
  });
});

const techPills = [
  { name: "NestJS", category: "Backend" },
  { name: "Vue 3", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Prisma / TypeORM", category: "ORM" },
  { name: "TailwindCSS", category: "Styling" },
  { name: "Docker", category: "DevOps" },
  { name: "REST APIs & JWT", category: "Security" },
];

const highlights = [
  {
    icon: Server,
    title: "Arquitetura Backend Sólida",
    description:
      "APIs resilientes e seguras com NestJS, autenticação JWT, validação rigorosa com class-validator e modelagem otimizada em PostgreSQL.",
  },
  {
    icon: Layers,
    title: "Interfaces Modernas & Reativas",
    description:
      "Aplicações ricas com Vue 3 (Composition API), Pinia para estado global performático e Tailwind CSS para design sob medida.",
  },
  {
    icon: ShieldCheck,
    title: "Código Limpo & Escalável",
    description:
      "Aplicação de padrões SOLID, modularização desacoplada, tipagem estrita com TypeScript e proteção de endpoints e rotas.",
  },
];
</script>

<template>
  <div class="space-y-28 sm:space-y-36 pb-20">
    <!-- Hero Section -->
    <section
      class="relative pt-12 sm:pt-20 lg:pt-28 text-center max-w-4xl mx-auto px-4"
    >
      <!-- Background Ambient Glow -->
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[550px] h-96 sm:h-[550px] bg-[#00ff87]/10 rounded-full blur-3xl pointer-events-none -z-10"
      />

      <!-- Availability Badge -->
      <div
        class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0e1411] border border-[#00ff87]/30 text-xs font-semibold text-[#00ff87] mb-8 shadow-[0_0_20px_rgba(0,255,135,0.15)]"
      >
        <span class="w-2 h-2 rounded-full bg-[#00ff87] animate-ping" />
        Desenvolvedor Full Stack • NestJS & Vue 3
      </div>

      <!-- Headline -->
      <h1
        class="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#f8fafc] tracking-tight leading-[1.1]"
      >
        Construindo sistemas digitais
        <span
          class="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff87] via-[#34d399] to-[#10b981] glow-text block mt-1"
        >
          robustos e elegantes.
        </span>
      </h1>

      <!-- Subtitle -->
      <p
        class="mt-6 text-base sm:text-xl text-[#94a3b8] leading-relaxed max-w-2xl mx-auto font-normal"
      >
        Desenvolvimento de ponta a ponta com foco em arquitetura escalável,
        performance e interfaces modernas com identidade autoral.
      </p>

      <!-- Action Buttons -->
      <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
        <BaseButton variant="primary" size="lg" to="/projetos">
          <span>Ver Projetos</span>
          <template #icon-right>
            <ArrowRight class="w-4 h-4" />
          </template>
        </BaseButton>

        <BaseButton variant="secondary" size="lg" href="#contato">
          <template #icon-left>
            <Send class="w-4 h-4 text-[#00ff87]" />
          </template>
          <span>Entrar em Contato</span>
        </BaseButton>
      </div>

      <!-- Tech Stack Badges -->
      <div
        class="mt-14 pt-8 border-t border-white/5 flex flex-wrap items-center justify-center gap-2.5"
      >
        <span
          v-for="pill in techPills"
          :key="pill.name"
          class="px-3 py-1 rounded-md text-xs font-medium bg-[#0e1411] border border-white/10 text-[#cbd5e1] hover:border-[#00ff87]/40 hover:text-[#00ff87] transition cursor-default"
        >
          {{ pill.name }}
        </span>
      </div>
    </section>

    <!-- Highlights / Diferenciais -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div
          v-for="item in highlights"
          :key="item.title"
          class="bg-[#0e1411] border border-white/5 hover:border-[#00ff87]/30 rounded-2xl p-7 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,255,135,0.08)]"
        >
          <div
            class="w-12 h-12 rounded-xl bg-[#00ff87]/10 border border-[#00ff87]/20 flex items-center justify-center text-[#00ff87]"
          >
            <component :is="item.icon" class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-[#f8fafc]">{{ item.title }}</h3>
          <p class="text-sm text-[#94a3b8] leading-relaxed">
            {{ item.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Featured Projects Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div
        class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/5"
      >
        <div>
          <div
            class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00ff87] mb-1"
          >
            <Sparkles class="w-3.5 h-3.5" />
            Portfólio Selecionado
          </div>
          <h2
            class="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] tracking-tight"
          >
            Projetos em Destaque
          </h2>
        </div>

        <RouterLink
          to="/projetos"
          class="inline-flex items-center gap-2 text-sm font-semibold text-[#00ff87] hover:text-[#34d399] transition group"
        >
          <span>Ver todos os projetos</span>
          <ArrowRight
            class="w-4 h-4 group-hover:translate-x-1 transition-transform"
          />
        </RouterLink>
      </div>

      <ProjectGrid
        :projects="projectsStore.featuredProjects"
        :loading="projectsStore.isLoading"
        :limit="3"
        :highlight-first="true"
      />
    </section>

    <!-- About Section (#sobre) -->
    <section id="sobre" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="bg-[#0e1411] border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden"
      >
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div class="lg:col-span-7 space-y-6">
            <div
              class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00ff87]"
            >
              <Terminal class="w-3.5 h-3.5" />
              Sobre Mim & Filosofia de Trabalho
            </div>

            <h2
              class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#f8fafc] leading-tight"
            >
              Desenvolvedor focado em engenharia de software com alto padrão
              visual.
            </h2>

            <p class="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
              Trabalho no desenvolvimento de aplicações completas unindo a
              solidez de arquiteturas no backend com a fluidez de interfaces
              modernas no frontend. Meu foco está em entregar código limpo,
              performático e bem documentado.
            </p>

            <div class="space-y-3 pt-2">
              <div class="flex items-start gap-3">
                <CheckCircle2 class="w-5 h-5 text-[#00ff87] shrink-0 mt-0.5" />
                <span class="text-sm text-[#cbd5e1]">
                  Domínio de NestJS com arquitetura modular, DTOs, guards e
                  TypeORM / Prisma.
                </span>
              </div>
              <div class="flex items-start gap-3">
                <CheckCircle2 class="w-5 h-5 text-[#00ff87] shrink-0 mt-0.5" />
                <span class="text-sm text-[#cbd5e1]">
                  Criação de SPA responsivas com Vue 3, Pinia, TypeScript e
                  Tailwind CSS.
                </span>
              </div>
              <div class="flex items-start gap-3">
                <CheckCircle2 class="w-5 h-5 text-[#00ff87] shrink-0 mt-0.5" />
                <span class="text-sm text-[#cbd5e1]">
                  Foco em boas práticas, segurança de autenticação JWT e
                  experiência de usuário fluida.
                </span>
              </div>
            </div>
          </div>

          <div
            class="lg:col-span-5 bg-[#151d19] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6"
          >
            <h3
              class="text-base font-bold text-[#f8fafc] border-b border-white/5 pb-3"
            >
              Resumo Técnico
            </h3>

            <div class="space-y-4">
              <div>
                <span
                  class="text-xs text-[#64748b] uppercase tracking-wider block mb-1"
                  >Localização</span
                >
                <p class="text-sm font-semibold text-[#f8fafc]">
                  Brasil • Remoto
                </p>
              </div>

              <div>
                <span
                  class="text-xs text-[#64748b] uppercase tracking-wider block mb-1"
                  >Especialidade</span
                >
                <p class="text-sm font-semibold text-[#f8fafc]">
                  Full Stack (NestJS + Vue 3)
                </p>
              </div>

              <div>
                <span
                  class="text-xs text-[#64748b] uppercase tracking-wider block mb-1"
                  >Banco de Dados</span
                >
                <p class="text-sm font-semibold text-[#f8fafc]">
                  PostgreSQL, Redis
                </p>
              </div>

              <div>
                <span
                  class="text-xs text-[#64748b] uppercase tracking-wider block mb-1"
                  >Disponibilidade</span
                >
                <p
                  class="text-sm font-semibold text-[#00ff87] flex items-center gap-2"
                >
                  <span
                    class="w-2 h-2 rounded-full bg-[#00ff87] animate-pulse"
                  />
                  Aberta para novos projetos & contratos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section (#contato) -->
    <section id="contato" class="max-w-4xl mx-auto px-4 text-center space-y-8">
      <div class="space-y-3">
        <div
          class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00ff87]"
        >
          <Send class="w-3.5 h-3.5" />
          Vamos Conversar
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-[#f8fafc]">
          Tem um projeto ou oportunidade em mente?
        </h2>
        <p class="text-sm sm:text-base text-[#94a3b8] max-w-xl mx-auto">
          Fique à vontade para entrar em contato através das minhas redes ou
          enviar um e-mail direto.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href="mailto:erik.maia15oliveira@gmail.com"
          class="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[#0e1411] border border-white/10 hover:border-[#00ff87]/40 hover:shadow-[0_0_20px_rgba(0,255,135,0.15)] transition-all group"
        >
          <div
            class="w-12 h-12 rounded-xl bg-[#00ff87]/10 flex items-center justify-center text-[#00ff87] group-hover:scale-110 transition-transform"
          >
            <Mail class="w-6 h-6" />
          </div>
          <span class="text-sm font-bold text-[#f8fafc]">E-mail</span>
          <span class="text-xs text-[#94a3b8]">erik@example.com</span>
        </a>

        <a
          href="https://github.com/erikmaia15"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[#0e1411] border border-white/10 hover:border-[#00ff87]/40 hover:shadow-[0_0_20px_rgba(0,255,135,0.15)] transition-all group"
        >
          <div
            class="w-12 h-12 rounded-xl bg-[#00ff87]/10 flex items-center justify-center text-[#00ff87] group-hover:scale-110 transition-transform"
          >
            <Github class="w-6 h-6" />
          </div>
          <span class="text-sm font-bold text-[#f8fafc]">GitHub</span>
          <span class="text-xs text-[#94a3b8]">Ver repositórios</span>
        </a>

        <a
          href="https://www.linkedin.com/in/erik-maia-0a326237b"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[#0e1411] border border-white/10 hover:border-[#00ff87]/40 hover:shadow-[0_0_20px_rgba(0,255,135,0.15)] transition-all group"
        >
          <div
            class="w-12 h-12 rounded-xl bg-[#00ff87]/10 flex items-center justify-center text-[#00ff87] group-hover:scale-110 transition-transform"
          >
            <Linkedin class="w-6 h-6" />
          </div>
          <span class="text-sm font-bold text-[#f8fafc]">LinkedIn</span>
          <span class="text-xs text-[#94a3b8]">Conectar</span>
        </a>
      </div>
    </section>
  </div>
</template>
