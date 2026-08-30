<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from "vue";
import { RouterLink } from "vue-router";
import { useProjectsStore } from "@/stores/projects.store";
import { useSiteContentStore } from "@/stores/site-content.store";
import ProjectGrid from "@/components/project/ProjectGrid.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import GitGraph from "@/components/signature/GitGraph.vue";
import { useReducedMotion } from "@/composables/useReducedMotion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-vue-next";
import fotoPerfil from "@/assets/foto-perfil.jpg";

gsap.registerPlugin(ScrollTrigger);

const projectsStore = useProjectsStore();
const siteContentStore = useSiteContentStore();
const { prefersReducedMotion } = useReducedMotion();

const heroRef = ref<HTMLElement | null>(null);
const aboutRef = ref<HTMLElement | null>(null);
const projectsRef = ref<HTMLElement | null>(null);
const contactRef = ref<HTMLElement | null>(null);
const photoRef = ref<HTMLElement | null>(null);

const ctx = ref<gsap.Context | null>(null);

const graphSections = [
  {
    id: "inicio",
    label: "Início",
    hash: "a3f2e1",
    commitMsg: "feat: hero section",
  },
  {
    id: "projetos",
    label: "Projetos",
    hash: "b7c4d2",
    commitMsg: "feat: projects grid",
  },
  {
    id: "sobre",
    label: "Sobre",
    hash: "e1a8f3",
    commitMsg: "docs: about & bio",
  },
  {
    id: "contato",
    label: "Contato",
    hash: "f4d6a9",
    commitMsg: "feat: contact links",
  },
];

const techStack = [
  { name: "NestJS", role: "API Framework" },
  { name: "Vue 3", role: "Interface" },
  { name: "TypeScript", role: "Linguagem" },
  { name: "PostgreSQL", role: "Banco de Dados" },
  { name: "Prisma", role: "ORM" },
  { name: "Docker", role: "Infra" },
  { name: "Redis", role: "Cache" },
];

const contactLinks = [
  {
    href: "mailto:erik.maia15oliveira@gmail.com",
    icon: Mail,
    label: "Email",
    detail: "erik.maia15oliveira@gmail.com",
  },
  {
    href: "https://github.com/erikmaia15",
    icon: Github,
    label: "GitHub",
    detail: "erikmaia15",
  },
  {
    href: "https://www.linkedin.com/in/erik-maia-0a326237b",
    icon: Linkedin,
    label: "LinkedIn",
    detail: "erik-maia",
  },
];

onMounted(async () => {
  projectsStore.fetchProjects().catch(() => {});
  await siteContentStore.fetchContent().catch(() => {});

  await nextTick();

  if (prefersReducedMotion.value) return;

  ctx.value = gsap.context(() => {
    // === HERO ENTRANCE TIMELINE ===
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Set initial states
    gsap.set(".hero-label", { opacity: 0, y: 16 });
    gsap.set(".hero-headline-word", { opacity: 0, y: 20 });
    gsap.set(".hero-sub", { opacity: 0, y: 16 });
    gsap.set(".hero-stack-item", { opacity: 0, y: 12, scale: 0.95 });
    gsap.set(".hero-actions", { opacity: 0, y: 16 });

    heroTl
      .to(".hero-label", { opacity: 1, y: 0, duration: 0.4 }, 0.2)
      .to(
        ".hero-headline-word",
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
        },
        0.4,
      )
      .to(".hero-sub", { opacity: 1, y: 0, duration: 0.5 }, "-=0.15")
      .to(
        ".hero-stack-item",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          stagger: 0.06,
        },
        "-=0.2",
      )
      .to(".hero-actions", { opacity: 1, y: 0, duration: 0.45 }, "-=0.15");

    // === PROJECTS SECTION REVEAL ===
    if (projectsRef.value) {
      gsap.set(projectsRef.value.querySelectorAll(".reveal-child"), {
        opacity: 0,
        y: 20,
      });
      ScrollTrigger.create({
        trigger: projectsRef.value,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(projectsRef.value!.querySelectorAll(".reveal-child"), {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          });
        },
      });
    }

    // === ABOUT SECTION REVEAL ===
    if (aboutRef.value) {
      gsap.set(aboutRef.value.querySelectorAll(".reveal-child"), {
        opacity: 0,
        y: 20,
      });

      // Photo clip-path reveal
      if (photoRef.value) {
        gsap.set(photoRef.value, { clipPath: "inset(100% 0% 0% 0%)" });
      }

      ScrollTrigger.create({
        trigger: aboutRef.value,
        start: "top 82%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(aboutRef.value!.querySelectorAll(".reveal-child"), {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
          });
          if (photoRef.value) {
            tl.to(
              photoRef.value,
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.8,
                ease: "power3.inOut",
              },
              0.15,
            );
          }
        },
      });
    }

    // === CONTACT SECTION REVEAL ===
    if (contactRef.value) {
      gsap.set(contactRef.value.querySelectorAll(".reveal-child"), {
        opacity: 0,
        y: 20,
      });
      ScrollTrigger.create({
        trigger: contactRef.value,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(contactRef.value!.querySelectorAll(".reveal-child"), {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          });
        },
      });
    }
  });
});

onUnmounted(() => {
  ctx.value?.revert();
});
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
        <div class="space-y-6 sm:space-y-8 mt-12 sm:mt-0 relative z-10">
          <span class="hero-label section-label block">{{
            siteContentStore.homeContent?.eyebrow || "01 · INÍCIO"
          }}</span>

          <h1
            class="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-[--text-primary] tracking-tight leading-[1.1]"
          >
            <span
              v-for="(word, i) in (
                siteContentStore.homeContent?.headline ||
                'Construo a infraestrutura que faz produtos funcionarem.'
              ).split(' ')"
              :key="i"
              class="hero-headline-word inline-block"
            >
              {{ word }}&nbsp;
            </span>
          </h1>

          <p
            class="hero-sub text-base sm:text-lg font-body text-[--text-secondary] leading-relaxed max-w-2xl"
          >
            {{
              siteContentStore.homeContent?.description ||
              "APIs em NestJS, interfaces em Vue 3, dados em PostgreSQL. Do schema do banco ao deploy — eu codifico o pipeline inteiro."
            }}
          </p>

          <!-- Tech stack with stagger animation -->
          <div class="flex flex-wrap gap-3">
            <div
              v-for="tech in siteContentStore.homeContent?.skills || techStack"
              :key="tech.label || tech.name"
              class="hero-stack-item flex items-center gap-2 px-3 py-1.5 bg-[--surface] border border-[--border-subtle] rounded-md hover:border-[--border-accent] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(99,102,241,0.1)] transition-all duration-200 group cursor-default"
            >
              <span
                class="text-xs font-mono font-medium text-[--text-primary] group-hover:text-[--accent] transition-colors"
              >
                {{ tech.label || tech.name }}
              </span>
              <span
                class="text-[10px] font-mono text-[--text-muted] hidden sm:inline"
              >
                {{ tech.category || tech.role }}
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
        <div
          class="reveal-child flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div class="space-y-2">
            <span class="section-label">02 · Projetos</span>
            <h2
              class="text-2xl sm:text-3xl font-display font-bold text-[--text-primary] tracking-tight"
            >
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

        <div class="reveal-child">
          <ProjectGrid
            :projects="projectsStore.featuredProjects"
            :loading="projectsStore.isLoading"
            :limit="3"
            :highlight-first="true"
          />
        </div>
      </section>

      <!-- ============================================ -->
      <!-- ABOUT SECTION -->
      <!-- ============================================ -->
      <section id="sobre" ref="aboutRef" class="max-w-6xl mx-auto px-5 sm:px-8">
        <div
          class="bg-[--surface] border border-[--border-subtle] rounded-lg p-8 sm:p-12 lg:p-16"
        >
          <div
            class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
          >
            <!-- Photo + Bio column -->
            <div class="lg:col-span-7 space-y-6">
              <span class="reveal-child section-label block">03 · Sobre</span>

              <div class="flex flex-col sm:flex-row gap-8 items-start">
                <!-- Profile photo with duotone + clip-path reveal -->
                <div
                  ref="photoRef"
                  class="photo-duotone w-48 h-56 sm:w-52 sm:h-64 shrink-0"
                >
                  <img
                    src="../../assets/foto-perfil.jpg"
                    alt="Foto de Erik"
                    loading="lazy"
                  />
                </div>

                <div class="space-y-4">
                  <h2
                    class="reveal-child text-2xl sm:text-3xl font-display font-bold text-[--text-primary] tracking-tight"
                  >
                    {{ siteContentStore.aboutContent?.name || "Erik Maia" }}
                  </h2>

                  <template
                    v-if="siteContentStore.aboutContent?.bioParagraphs?.length"
                  >
                    <p
                      v-for="(p, i) in siteContentStore.aboutContent
                        .bioParagraphs"
                      :key="i"
                      class="reveal-child text-sm font-body text-[--text-secondary] leading-relaxed"
                    >
                      {{ p }}
                    </p>
                  </template>
                  <template v-else>
                    <p
                      class="reveal-child text-sm font-body text-[--text-secondary] leading-relaxed"
                    >
                      Desenvolvedor focado em construir sistemas que não quebram
                      quando o tráfego aumenta. Trabalho de ponta a ponta:
                      modelo os dados, escrevo a API em NestJS com arquitetura
                      modular (DTOs, guards, autenticação JWT), e construo a
                      interface em Vue 3 com TypeScript e Tailwind.
                    </p>

                    <p
                      class="reveal-child text-sm font-body text-[--text-secondary] leading-relaxed"
                    >
                      Uso Redis pra cache quando a performance importa e Docker
                      pra manter o ambiente igual do meu setup até a produção.
                      Prefiro entender o problema todo antes de escrever a
                      primeira linha — é mais rápido corrigir uma decisão no
                      papel do que refatorar em produção.
                    </p>

                    <p
                      class="reveal-child text-sm font-body text-[--text-secondary] leading-relaxed"
                    >
                      Programo há 1 a 2 anos, com foco em projetos reais que
                      precisam funcionar sob uso de verdade, não só rodar
                      localmente. Aberto a estágio, CLT ou projetos freelance.
                    </p>
                  </template>
                </div>
              </div>
            </div>

            <!-- Technical summary -->
            <div
              class="reveal-child lg:col-span-5 bg-[--surface-elevated] border border-[--border-subtle] rounded-md p-6 space-y-5"
            >
              <h3
                class="text-sm font-display font-bold text-[--text-primary] pb-3 border-b border-[--border-subtle]"
              >
                Resumo Técnico
              </h3>

              <div class="space-y-4">
                <div>
                  <span
                    class="text-[10px] font-mono text-[--text-muted] uppercase tracking-wider block mb-1"
                    >Localização</span
                  >
                  <p
                    class="text-sm font-body font-medium text-[--text-primary]"
                  >
                    Brasil · Remoto
                  </p>
                </div>

                <div>
                  <span
                    class="text-[10px] font-mono text-[--text-muted] uppercase tracking-wider block mb-1"
                    >Especialidade</span
                  >
                  <p
                    class="text-sm font-body font-medium text-[--text-primary]"
                  >
                    Full Stack (NestJS + Vue 3)
                  </p>
                </div>

                <div>
                  <span
                    class="text-[10px] font-mono text-[--text-muted] uppercase tracking-wider block mb-1"
                    >Banco de Dados</span
                  >
                  <p
                    class="text-sm font-body font-medium text-[--text-primary]"
                  >
                    PostgreSQL, Redis
                  </p>
                </div>

                <div>
                  <span
                    class="text-[10px] font-mono text-[--text-muted] uppercase tracking-wider block mb-1"
                    >Modelo de trabalho</span
                  >
                  <p
                    class="text-sm font-body font-medium text-[--text-primary]"
                  >
                    CLT, Estágio ou Freelance/PJ
                  </p>
                </div>

                <div>
                  <span
                    class="text-[10px] font-mono text-[--text-muted] uppercase tracking-wider block mb-1"
                    >Disponibilidade</span
                  >
                  <p
                    class="text-sm font-body font-medium text-[--accent] flex items-center gap-2"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full bg-[--accent] animate-pulse"
                    />
                    Aberta para novos projetos & contratos
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
            <span class="reveal-child section-label block">04 · Contato</span>
            <h2
              class="reveal-child text-2xl sm:text-3xl font-display font-bold text-[--text-primary] tracking-tight"
            >
              Vamos construir algo.
            </h2>
            <p
              class="reveal-child text-sm sm:text-base font-body text-[--text-secondary] leading-relaxed"
            >
              Se você tem uma vaga, um projeto freelance ou uma posição de
              estágio onde eu possa contribuir de verdade, me manda uma
              mensagem.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              v-for="link in contactLinks"
              :key="link.label"
              :href="link.href"
              :target="link.href.startsWith('mailto') ? undefined : '_blank'"
              :rel="
                link.href.startsWith('mailto')
                  ? undefined
                  : 'noopener noreferrer'
              "
              class="reveal-child card-border-grow flex flex-col gap-3 p-5 rounded-lg bg-[--surface] border border-[--border-subtle] hover:border-[--border-accent] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.08)] transition-all duration-300 group"
            >
              <div
                class="w-10 h-10 rounded-md bg-[--accent-dim] flex items-center justify-center text-[--accent] group-hover:bg-[--accent] group-hover:text-[--canvas] transition-colors duration-200"
              >
                <component :is="link.icon" class="w-4 h-4" />
              </div>
              <div>
                <span
                  class="text-sm font-body font-semibold text-[--text-primary] block"
                  >{{ link.label }}</span
                >
                <span class="text-xs font-mono text-[--text-muted]">{{
                  link.detail
                }}</span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
