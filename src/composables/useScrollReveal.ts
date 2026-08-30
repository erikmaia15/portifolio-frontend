import { onMounted, onUnmounted, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function useScrollReveal(
  targets: Ref<(HTMLElement | null)[]>,
  options: {
    y?: number
    duration?: number
    stagger?: number
    start?: string
  } = {}
) {
  const { prefersReducedMotion } = useReducedMotion()
  const tweens: gsap.core.Tween[] = []

  const {
    y = 24,
    duration = 0.8,
    stagger = 0.12,
    start = 'top 85%',
  } = options

  onMounted(() => {
    if (prefersReducedMotion.value) return

    targets.value.forEach((el) => {
      if (!el) return

      gsap.set(el, { opacity: 0, y })

      const tween = gsap.to(el, {
        opacity: 1,
        y: 0,
        duration,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none none',
        },
      })

      tweens.push(tween)
    })
  })

  onUnmounted(() => {
    tweens.forEach((t) => t.scrollTrigger?.kill())
    tweens.length = 0
  })
}
