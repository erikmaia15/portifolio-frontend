<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useProjectsStore } from '@/stores/projects.store'
import ProjectGrid from '@/components/project/ProjectGrid.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import GitGraph from '@/components/signature/GitGraph.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
} from 'lucide-vue-next'
import fotoPerfil from '@/assets/foto-perfil.jpg'

gsap.registerPlugin(ScrollTrigger)

const projectsStore = useProjectsStore()
const { prefersReducedMotion } = useReducedMotion()

const heroRef = ref<HTMLElement | null>(null)
const aboutRef = ref<HTMLElement | null>(null)
const projectsRef = ref<HTMLElement | null>(null)
const contactRef = ref<HTMLElement | null>(null)

const ctx = ref<gsap.Context | null>(null)

const graphSections = [
  { id: 'inicio', label: 'Início', hash: 'a3f2e1' },
  { id: 'projetos', label: 'Projetos', hash: 'b7c4d2' },
  { id: 'sobre', label: 'Sobre', hash: 'e1a8f3' },
  { id: 'contato', label: 'Contato', hash: 'f4d6a9' },
]

const techStack = [
  { name: 'NestJS', role: 'API Framework' },
  { name: 'Vue 3', role: 'Interface' },
  { name: 'TypeScript', role: 'Linguagem' },
  { name: 'PostgreSQL', role: 'Banco de Dados' },
  { name: 'Prisma', role: 'ORM' },
  { name: 'Docker', role: 'Infra' },
  { name: 'Redis', role: 'Cache' },
]

const contactLinks = [
  {
    href: 'mailto:erik.maia15oliveira@gmail.com',
    icon: Mail,
    label: 'Email',
    detail: 'erik.maia15oliveira@gmail.com',
  },
  {
    href: 'https://github.com/erikmaia15',
    icon: Github,
    label: 'GitHub',
    detail: 'erikmaia15',
  },
  {
    href: 'https://www.linkedin.com/in/erik-maia-0a326237b',
    icon: Linkedin,
    label: 'LinkedIn',
    detail: 'erik-maia',
  },
]

onMounted(() => {
  projectsStore.fetchProjects().catch(() => {})

  if (prefersReducedMotion.value) return

  ctx.value = gsap.context(() => {
    // Hero entrance timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from('.hero-label', { opacity: 0, y: 12, duration: 0.5, delay: 0.3 })
      .from('.hero-headline', { opacity: 0, y: 20, duration: 0.7 }, '-=0.2')
      .from('.hero-sub', { opacity: 0, y: 16, duration: 0.5 }, '-=0.3')
      .from('.hero-stack', { opacity: 0, y: 12, duration: 0.5 }, '-=0.2')
      .from('.hero-actions', { opacity: 0, y: 16, duration: 0.5 }, '-=0.2')

    // Scroll reveals
    const revealSections = [projectsRef.value, aboutRef.value, contactRef.value]
    revealSections.forEach((section) => {
      if (!section) return
      gsap.from(section, {
        opacity: 0,
        y: 32,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
    })
  })
})

onUnmounted(() => {
  ctx.value?.revert()
})
</script>

<template>
  <div class="relative">
    <!-- Git Graph sidebar -->
    <GitGraph :sections="graphSections" />

    <div class="space-y-32 sm:space-y-40 pb-24">
      <!-- ============================================ -->
      <!-- HERO SECTION -->
      <!-- ============================================ -->
      <section
        id="inicio"
        ref="heroRef"
        class="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 lg:pt-32"
      >
        <div class="max-w-3xl space-y-8">
          <span class="hero-label section-label block">01 · Início</span>

          <h1 class="hero-headline text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-[--text-primary] tracking-tight leading-[1.1]">
            Construo a infraestrutura que faz produtos
            <span class="text-[--accent]">funcionarem.</span>
          </h1>

          <p class="hero-sub text-base sm:text-lg font-body text-[--text-secondary] leading-relaxed max-w-2xl">
            APIs em NestJS, interfaces em Vue 3, dados em PostgreSQL.
            Do schema do banco ao deploy na Vercel — eu codifico todo o pipeline.
          </p>

          <!-- Tech stack as structured list, not generic badges -->
          <div class="hero-stack flex flex-wrap gap-3">
            <div
              v-for="tech in techStack"
              :key="tech.name"
              class="flex items-center gap-2 px-3 py-1.5 bg-[--surface] border border-[--border-subtle] rounded-md hover:border-[--border-accent] transition-colors duration-200 group cursor-default"
            >
              <span class="text-xs font-mono font-medium text-[--text-primary] group-hover:text-[--accent] transition-colors">
                {{ tech.name }}
              </span>
              <span class="text-[10px] font-mono text-[--text-muted] hidden sm:inline">
                {{ tech.role }}
              </span>
            </div>
          </div>

          <div class="hero-actions flex flex-wrap items-center gap-4 pt-2">
            <BaseButton variant="primary" size="lg" to="/projetos">
              <span>Ver Projetos</span>
              <template #icon-right>
                <ArrowRight class="w-4 h-4" />
              </template>
            </BaseButton>

            <BaseButton variant="secondary" size="lg" href="#contato">
              Fale Comigo
            </BaseButton>
          </div>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- FEATURED PROJECTS SECTION -->
      <!-- ============================================ -->
      <section
        id="projetos"
        ref="projectsRef"
        class="max-w-6xl mx-auto px-5 sm:px-8 space-y-8"
      >
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div class="space-y-2">
            <span class="section-label">02 · Projetos</span>
            <h2 class="text-2xl sm:text-3xl font-display font-bold text-[--text-primary] tracking-tight">
              Projetos em Destaque
            </h2>
          </div>

          <RouterLink
            to="/projetos"
            class="inline-flex items-center gap-1.5 text-sm font-body font-medium text-[--accent] hover:text-[--accent-hover] transition-colors group"
          >
            <span>Ver todos</span>
            <ArrowRight
              class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
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

      <!-- ============================================ -->
      <!-- ABOUT SECTION -->
      <!-- ============================================ -->
      <section
        id="sobre"
        ref="aboutRef"
        class="max-w-6xl mx-auto px-5 sm:px-8"
      >
        <div class="bg-[--surface] border border-[--border-subtle] rounded-lg p-8 sm:p-12 lg:p-16">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <!-- Photo + Bio column -->
            <div class="lg:col-span-7 space-y-6">
              <span class="section-label">03 · Sobre</span>

              <div class="flex flex-col sm:flex-row gap-8 items-start">
                <!-- Profile photo with duotone treatment -->
                <div class="photo-duotone w-40 h-48 sm:w-44 sm:h-52 shrink-0">
                  <img
                    :src="fotoPerfil"
                    alt="Foto de Erik"
                    loading="lazy"
                  />
                </div>

                <div class="space-y-4">
                  <h2 class="text-2xl sm:text-3xl font-display font-bold text-[--text-primary] tracking-tight">
                    Erik Maia
                  </h2>

                  <p class="text-sm font-body text-[--text-secondary] leading-relaxed">
                    Desenvolvedor full stack do Brasil. Meu trabalho é montar o backend que aguenta carga e o frontend que as pessoas realmente usam.
                  </p>

                  <p class="text-sm font-body text-[--text-secondary] leading-relaxed">
                    Escrevo APIs modulares com NestJS e TypeORM, modelos de dados normalizados em PostgreSQL, e interfaces reativas com Vue 3 e Composition API. Gosto de TypeScript estrito — sem <code class="font-mono text-[--accent] text-xs bg-[--accent-dim] px-1 py-0.5 rounded">any</code>, sem gambiarras.
                  </p>

                  <p class="text-sm font-body text-[--text-secondary] leading-relaxed">
                    Quando um projeto precisa de cache, eu configuro Redis. Quando precisa de isolamento, eu containerizo com Docker. Eu gosto de código que funciona em produção sem surpreender ninguém às 3 da manhã.
                  </p>
                </div>
              </div>
            </div>

            <!-- Technical summary -->
            <div
              class="lg:col-span-5 bg-[--surface-elevated] border border-[--border-subtle] rounded-md p-6 space-y-5"
            >
              <h3 class="text-sm font-display font-bold text-[--text-primary] pb-3 border-b border-[--border-subtle]">
                Resumo Técnico
              </h3>

              <div class="space-y-4">
                <div>
                  <span class="text-[10px] font-mono text-[--text-muted] uppercase tracking-wider block mb-1">Localização</span>
                  <p class="text-sm font-body font-medium text-[--text-primary]">Brasil · Remoto</p>
                </div>

                <div>
                  <span class="text-[10px] font-mono text-[--text-muted] uppercase tracking-wider block mb-1">Especialidade</span>
                  <p class="text-sm font-body font-medium text-[--text-primary]">Full Stack — NestJS + Vue 3</p>
                </div>

                <div>
                  <span class="text-[10px] font-mono text-[--text-muted] uppercase tracking-wider block mb-1">Banco de Dados</span>
                  <p class="text-sm font-body font-medium text-[--text-primary]">PostgreSQL, Redis</p>
                </div>

                <div>
                  <span class="text-[10px] font-mono text-[--text-muted] uppercase tracking-wider block mb-1">Infra</span>
                  <p class="text-sm font-body font-medium text-[--text-primary]">Docker, Vercel, CI/CD</p>
                </div>

                <div>
                  <span class="text-[10px] font-mono text-[--text-muted] uppercase tracking-wider block mb-1">Status</span>
                  <p class="text-sm font-body font-medium text-[--accent] flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-[--accent] animate-pulse" />
                    Disponível para projetos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- CONTACT SECTION -->
      <!-- ============================================ -->
      <section
        id="contato"
        ref="contactRef"
        class="max-w-6xl mx-auto px-5 sm:px-8"
      >
        <div class="max-w-2xl space-y-8">
          <div class="space-y-3">
            <span class="section-label">04 · Contato</span>
            <h2 class="text-2xl sm:text-3xl font-display font-bold text-[--text-primary] tracking-tight">
              Vamos construir algo.
            </h2>
            <p class="text-sm sm:text-base font-body text-[--text-secondary] leading-relaxed">
              Se você tem um projeto que precisa de backend sólido ou uma interface que funcione de verdade, me mande uma mensagem.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              v-for="link in contactLinks"
              :key="link.label"
              :href="link.href"
              :target="link.href.startsWith('mailto') ? undefined : '_blank'"
              :rel="link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'"
              class="card-border-grow flex flex-col gap-3 p-5 rounded-lg bg-[--surface] border border-[--border-subtle] hover:border-[--border-accent] transition-all duration-200 group"
            >
              <div
                class="w-10 h-10 rounded-md bg-[--accent-dim] flex items-center justify-center text-[--accent] group-hover:bg-[--accent] group-hover:text-[--canvas] transition-colors duration-200"
              >
                <component :is="link.icon" class="w-4 h-4" />
              </div>
              <div>
                <span class="text-sm font-body font-semibold text-[--text-primary] block">{{ link.label }}</span>
                <span class="text-xs font-mono text-[--text-muted]">{{ link.detail }}</span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
