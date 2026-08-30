<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

interface Section {
  id: string
  label: string
  hash: string
}

const props = defineProps<{
  sections: Section[]
}>()

const { prefersReducedMotion } = useReducedMotion()
const activeSectionIndex = ref(0)
const lineDrawn = ref(false)
const svgRef = ref<SVGSVGElement | null>(null)

const nodeSpacing = 280
const svgHeight = computed(() => (props.sections.length - 1) * nodeSpacing + 80)

const observers: IntersectionObserver[] = []

onMounted(() => {
  // Draw-in animation
  if (!prefersReducedMotion.value) {
    setTimeout(() => {
      lineDrawn.value = true
    }, 300)
  } else {
    lineDrawn.value = true
  }

  // Observe sections for active state
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
  observers.forEach((o) => o.disconnect())
})
</script>

<template>
  <div class="hidden lg:block fixed left-8 xl:left-12 top-1/2 -translate-y-1/2 z-20" aria-hidden="true">
    <svg
      ref="svgRef"
      :width="48"
      :height="svgHeight"
      :viewBox="`0 0 48 ${svgHeight}`"
      fill="none"
      class="overflow-visible"
    >
      <!-- Main vertical line -->
      <line
        x1="24" y1="20"
        x2="24" :y2="svgHeight - 20"
        stroke="var(--border-subtle)"
        stroke-width="1"
      />
      <!-- Animated progress line -->
      <line
        x1="24" y1="20"
        x2="24" :y2="svgHeight - 20"
        stroke="var(--accent)"
        stroke-width="1"
        :stroke-dasharray="svgHeight - 40"
        :stroke-dashoffset="lineDrawn ? 0 : svgHeight - 40"
        :style="{
          transition: prefersReducedMotion ? 'none' : `stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1) 0.5s`,
        }"
      />

      <!-- Nodes -->
      <g v-for="(section, i) in sections" :key="section.id">
        <!-- Node circle -->
        <circle
          cx="24"
          :cy="20 + i * nodeSpacing"
          :r="activeSectionIndex >= i ? 6 : 4"
          :fill="activeSectionIndex >= i ? 'var(--accent-warm)' : 'var(--surface-elevated)'"
          :stroke="activeSectionIndex >= i ? 'var(--accent-warm)' : 'var(--border-subtle)'"
          stroke-width="2"
          :style="{
            transition: prefersReducedMotion ? 'none' : 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          }"
        />
        <!-- Glow ring when active -->
        <circle
          v-if="activeSectionIndex === i"
          cx="24"
          :cy="20 + i * nodeSpacing"
          r="10"
          fill="none"
          stroke="var(--accent-warm)"
          stroke-width="1"
          opacity="0.3"
        />
      </g>
    </svg>

    <!-- Labels alongside -->
    <div
      class="absolute left-14 top-0 flex flex-col"
      :style="{ height: `${svgHeight}px` }"
    >
      <div
        v-for="(section, i) in sections"
        :key="section.id"
        class="absolute flex items-center gap-2"
        :style="{ top: `${16 + i * nodeSpacing}px` }"
      >
        <span
          class="font-mono text-[10px] tracking-wider transition-colors duration-300"
          :class="activeSectionIndex >= i ? 'text-[--accent-warm]' : 'text-[--text-muted]'"
        >
          {{ section.hash }}
        </span>
      </div>
    </div>
  </div>
</template>
