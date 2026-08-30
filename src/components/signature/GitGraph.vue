<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

interface Section {
  id: string
  label: string
  hash: string
  commitMsg?: string
}

const props = defineProps<{
  sections: Section[]
}>()

const { prefersReducedMotion } = useReducedMotion()
const activeSectionIndex = ref(0)
const scrollProgress = ref(0)
const hoveredIndex = ref<number | null>(null)

const nodeSpacing = 200
const svgHeight = computed(() => (props.sections.length - 1) * nodeSpacing + 40)
const lineLength = computed(() => svgHeight.value - 40)

const progressOffset = computed(() => {
  if (prefersReducedMotion.value) return 0
  return lineLength.value * (1 - scrollProgress.value)
})

const observers: IntersectionObserver[] = []

function handleScroll() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight <= 0) {
    scrollProgress.value = 1
    return
  }
  scrollProgress.value = Math.min(window.scrollY / docHeight, 1)
}

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function getNodeState(index: number): 'active' | 'committed' | 'pending' {
  if (index === activeSectionIndex.value) return 'active'
  if (index < activeSectionIndex.value) return 'committed'
  return 'pending'
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()

  props.sections.forEach((section, index) => {
    const el = document.getElementById(section.id)
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSectionIndex.value = index
          }
        })
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    observer.observe(el)
    observers.push(observer)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  observers.forEach((o) => o.disconnect())
})
</script>

<template>
  <nav
    class="hidden lg:flex fixed left-6 xl:left-10 top-1/2 -translate-y-1/2 z-20 flex-col items-start"
    aria-label="Navegação por seções"
  >
    <svg
      :width="48"
      :height="svgHeight"
      :viewBox="`0 0 48 ${svgHeight}`"
      fill="none"
      class="overflow-visible absolute left-0 top-0"
      aria-hidden="true"
    >
      <!-- Background track -->
      <line
        x1="12" y1="20"
        x2="12" :y2="svgHeight - 20"
        stroke="var(--border-subtle)"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <!-- Progress line (scroll-driven) -->
      <line
        x1="12" y1="20"
        x2="12" :y2="svgHeight - 20"
        stroke="var(--accent)"
        stroke-width="1.5"
        stroke-linecap="round"
        :stroke-dasharray="lineLength"
        :stroke-dashoffset="progressOffset"
        class="git-progress-line"
      />

      <!-- Nodes -->
      <g v-for="(section, i) in sections" :key="section.id">
        <!-- Outer glow ring (active only) -->
        <circle
          v-if="getNodeState(i) === 'active'"
          cx="12"
          :cy="20 + i * nodeSpacing"
          r="11"
          fill="none"
          stroke="var(--accent-warm)"
          stroke-width="1"
          :opacity="prefersReducedMotion ? 0.3 : undefined"
          :class="{ 'git-glow-ring': !prefersReducedMotion }"
        />

        <!-- Node circle -->
        <circle
          cx="12"
          :cy="20 + i * nodeSpacing"
          :r="getNodeState(i) === 'active' ? 5.5 : getNodeState(i) === 'committed' ? 4.5 : 3.5"
          :fill="
            getNodeState(i) === 'active'
              ? 'var(--accent-warm)'
              : getNodeState(i) === 'committed'
                ? 'var(--accent)'
                : 'var(--surface-elevated)'
          "
          :stroke="
            getNodeState(i) === 'pending'
              ? 'var(--text-muted)'
              : 'none'
          "
          :stroke-width="getNodeState(i) === 'pending' ? 1.5 : 0"
          class="git-node"
        />
      </g>
    </svg>

    <!-- Clickable hash labels -->
    <div
      class="relative flex flex-col"
      :style="{ height: `${svgHeight}px` }"
    >
      <button
        v-for="(section, i) in sections"
        :key="section.id"
        class="absolute left-8 flex items-center gap-2 group cursor-pointer bg-transparent border-none p-0"
        :style="{ top: `${14 + i * nodeSpacing}px` }"
        @click="scrollToSection(section.id)"
        @mouseenter="hoveredIndex = i"
        @mouseleave="hoveredIndex = null"
        :aria-label="`Ir para ${section.label}`"
      >
        <span
          class="font-mono text-[10px] tracking-wider transition-all duration-300 whitespace-nowrap"
          :class="{
            'text-[--accent-warm] scale-105 origin-left': getNodeState(i) === 'active',
            'text-[--accent] opacity-70': getNodeState(i) === 'committed',
            'text-[--text-muted]': getNodeState(i) === 'pending',
          }"
        >
          {{ section.hash }}
        </span>

        <!-- Tooltip (commit message) -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 translate-x-1"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 translate-x-1"
        >
          <span
            v-if="hoveredIndex === i && section.commitMsg"
            class="absolute left-full ml-3 px-2.5 py-1 bg-[--surface-elevated] border border-[--border-subtle] rounded text-[10px] font-mono text-[--text-secondary] whitespace-nowrap shadow-lg"
          >
            {{ section.commitMsg }}
          </span>
        </Transition>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.git-progress-line {
  transition: stroke-dashoffset 0.15s ease-out;
  will-change: stroke-dashoffset;
}

.git-node {
  transition: r 0.3s cubic-bezier(0.22, 1, 0.36, 1),
              fill 0.3s cubic-bezier(0.22, 1, 0.36, 1),
              stroke 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.git-glow-ring {
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.2; r: 10; }
  50% { opacity: 0.45; r: 12; }
}

@media (prefers-reduced-motion: reduce) {
  .git-progress-line {
    transition: none;
  }
  .git-node {
    transition: none;
  }
  .git-glow-ring {
    animation: none;
    opacity: 0.3;
  }
}
</style>
