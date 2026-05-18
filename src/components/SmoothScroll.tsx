import { ReactLenis, type LenisRef } from 'lenis/react'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMediaQuery } from '@/hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger)

type Props = { children: ReactNode }

const FADE_SELECTORS = [
  '[data-stat-card]',
  '[data-asset-card]',
  '[data-principle]',
  '[data-hub-spoke]',
  '[data-hub-card]',
  '[data-timeline-step]',
  '[data-timeline-line]',
  '[data-kpi]',
  '[data-realloc]',
  '[data-partner-bar]',
  '[data-complex]',
  '[data-bar-rate]',
  '[data-bar-install]',
  '[data-model-item]',
  '[data-brand-row]',
  '[data-brand-card]',
  '[data-kickoff-row]',
  '[data-kickoff-result]',
  '[data-std-row]',
  '[data-std-manual]',
  '[data-hw-row]',
  '[data-biz-step]',
  '[data-rev-card]',
  '[data-forms-step]',
  '[data-forms-usage]',
  '[data-vcat-step]',
  '[data-collab-item]',
  '[data-agenda]',
  '[data-center-row]',
  '[data-support-card]',
  '[data-closing]',
].join(',')

const HIDDEN_TRANSFORM_RE = /matrix\(\s*0|scale[XY]?\(\s*0|scale\(\s*0\s*[,)]/i

function isHidden(el: HTMLElement) {
  const cs = getComputedStyle(el)
  if (parseFloat(cs.opacity) < 0.5) return true
  if (HIDDEN_TRANSFORM_RE.test(cs.transform)) return true
  return false
}

function nudgeVisible(el: HTMLElement) {
  gsap.to(el, {
    opacity: 1,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    x: 0,
    y: 0,
    duration: 0.6,
    ease: 'expo.out',
    overwrite: 'auto',
  })
}

function nuclearVisible() {
  document.querySelectorAll<HTMLElement>(FADE_SELECTORS).forEach((el) => {
    const cs = getComputedStyle(el)
    if (parseFloat(cs.opacity) < 0.5) {
      el.style.opacity = '1'
    }
    if (HIDDEN_TRANSFORM_RE.test(cs.transform)) {
      el.style.transform = 'none'
    }
  })
}

export function SmoothScroll({ children }: Props) {
  const lenisRef = useRef<LenisRef | null>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const enabled = !isMobile && !prefersReducedMotion

  useEffect(() => {
    const refreshTimers = [80, 280, 700, 1500, 2800].map((d) =>
      setTimeout(() => ScrollTrigger.refresh(), d),
    )

    let observer: IntersectionObserver | null = null
    const setupObserver = () => {
      observer?.disconnect()
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return
            const el = e.target as HTMLElement
            if (isHidden(el)) {
              nudgeVisible(el)
            }
            observer?.unobserve(el)
          })
        },
        { threshold: [0, 0.01, 0.05, 0.1], rootMargin: '0px 0px -2% 0px' },
      )
      document
        .querySelectorAll<HTMLElement>(FADE_SELECTORS)
        .forEach((el) => observer?.observe(el))
    }

    const observerTimers = [500, 1400, 3000].map((d) =>
      setTimeout(setupObserver, d),
    )

    const nuclearTimer = setTimeout(nuclearVisible, 4500)

    if (!enabled) {
      return () => {
        refreshTimers.forEach(clearTimeout)
        observerTimers.forEach(clearTimeout)
        clearTimeout(nuclearTimer)
        observer?.disconnect()
      }
    }

    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    const rafId = requestAnimationFrame(() => {
      const lenis = lenisRef.current?.lenis
      if (lenis) {
        lenis.on('scroll', ScrollTrigger.update)
      }
      ScrollTrigger.refresh()
    })

    const onLoad = () => {
      ScrollTrigger.refresh()
      setupObserver()
    }
    window.addEventListener('load', onLoad)

    return () => {
      refreshTimers.forEach(clearTimeout)
      observerTimers.forEach(clearTimeout)
      clearTimeout(nuclearTimer)
      cancelAnimationFrame(rafId)
      gsap.ticker.remove(update)
      observer?.disconnect()
      lenisRef.current?.lenis?.off('scroll', ScrollTrigger.update)
      window.removeEventListener('load', onLoad)
    }
  }, [enabled])

  if (!enabled) {
    return <>{children}</>
  }

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  )
}
