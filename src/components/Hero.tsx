import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { heroMarquee, meta } from '@/data/content'
import { Marquee } from '@/components/Marquee'
import { HeroSpline } from '@/components/HeroSpline'
import { FloatingChips } from '@/components/FloatingChips'
import { FloatingArtifacts } from '@/components/FloatingArtifacts'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Hero() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('[data-hero-fade]', {
        opacity: 0,
        y: 28,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.09,
        delay: 0.15,
      })

      gsap.to('[data-hero-fade-out]', {
        opacity: 0,
        y: -36,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      })

      ScrollTrigger.matchMedia({
        '(min-width: 1024px)': () => {
          gsap.to('[data-hero-orb]', {
            yPercent: -8,
            ease: 'none',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.8,
            },
          })
        },
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-svh w-full flex-col overflow-hidden"
    >
      <div className="absolute inset-0 radial-spot" aria-hidden="true" />
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
      <FloatingArtifacts />

      <nav
        data-hero-fade
        className="relative z-30 flex items-center justify-between px-6 pt-6 md:px-12 md:pt-9"
      >
        <div className="flex items-center gap-3">
          <span
            className="grid size-9 place-items-center rounded-full bg-paiks-yellow text-void font-black text-sm"
            style={{ boxShadow: 'var(--shadow-glow-yellow)' }}
          >
            B
          </span>
          <span className="text-[10px] tracking-[0.32em] text-muted uppercase md:text-xs">
            {meta.brand}
          </span>
        </div>
        <span className="hidden md:inline text-[10px] tracking-[0.4em] text-muted uppercase">
          {meta.edition}
        </span>
      </nav>

      <div className="relative z-10 grid flex-1 grid-cols-1 items-center gap-10 px-6 pt-12 pb-6 md:px-12 md:pt-10 md:pb-8 lg:grid-cols-[1.55fr_1fr] lg:gap-14 lg:pt-6">
        <div data-hero-fade-out className="relative z-20 order-2 max-w-none lg:order-1">
          <p
            data-hero-fade
            className="mb-5 text-[10px] tracking-[0.42em] text-paiks-yellow uppercase md:text-xs"
          >
            Rollout Case · 2026
          </p>
          <h1
            data-hero-fade
            className="font-black tracking-tighter text-paper"
            style={{
              fontSize: 'clamp(2rem, 5.5vw, 4.75rem)',
              lineHeight: 0.98,
              letterSpacing: '-0.035em',
            }}
          >
            <span className="block whitespace-nowrap text-paper/95">
              PAIK&apos;S COFFEE
            </span>
            <span className="mt-2 block whitespace-nowrap">
              <span className="text-paper/85">전국 </span>
              <span className="glow-yellow text-neon-yellow">1,870</span>
              <span className="text-paper/85">개 매장 전환</span>
            </span>
          </h1>
          <p
            data-hero-fade
            className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 tracking-wide"
            style={{ fontSize: 'clamp(0.85rem, 1.3vw, 1.05rem)' }}
          >
            <span className="font-mono text-[11px] tracking-[0.36em] text-paiks-yellow uppercase">
              POS · KIOSK Rollout
            </span>
            <span className="text-paper/30">·</span>
            <span className="text-paper/55">{meta.period}</span>
          </p>

          <p
            data-hero-fade
            className="mt-7 max-w-none whitespace-nowrap text-[12px] text-paper/70 md:text-sm lg:text-[15px]"
            style={{ letterSpacing: '-0.005em' }}
          >
            <span className="font-semibold text-paper">더본코리아</span> 발주 ·{' '}
            <span className="font-semibold text-paper">비버웍스</span> 수행 —
            외식 프랜차이즈 IT 운영 사업으로 확장한 8개월 전개 기록.
          </p>

          <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#stats" className="btn-neon">
              핵심 지표 보기
              <span aria-hidden="true">↓</span>
            </a>
            <a href="#timeline" className="btn-ghost">
              타임라인
            </a>
          </div>

          <dl
            data-hero-fade
            className="mt-10 grid max-w-md grid-cols-3 gap-x-5 gap-y-3"
          >
            <Kv k="SCOPE" v={meta.scope} />
            <Kv k="ROLE" v="Rollout Lead" />
            <Kv k="SPAN" v="8 Months" />
          </dl>
        </div>

        <div
          data-hero-orb
          className="relative order-1 mx-auto aspect-square w-full max-w-[220px] md:max-w-xs lg:order-2 lg:max-w-sm xl:max-w-md"
        >
          <HeroSpline />
          <FloatingChips />
        </div>
      </div>

      <div className="relative z-10 mt-auto flex flex-col gap-1 border-t border-paiks-yellow/12 pt-3 pb-4">
        <div className="overflow-hidden">
          <div className="marquee-track slow bleed-marquee">
            {[...heroMarquee, ...heroMarquee].map((m, i) => (
              <span
                key={`${m}-${i}`}
                className="inline-flex items-center gap-10"
              >
                <span className="text-paper/0 [-webkit-text-stroke:1.5px_rgba(255,199,44,0.55)]">
                  {m}
                </span>
                <span
                  className="inline-block size-2 rounded-full bg-paiks-yellow shrink-0"
                  style={{ boxShadow: 'var(--shadow-glow-yellow)' }}
                  aria-hidden="true"
                />
              </span>
            ))}
          </div>
        </div>
        <Marquee items={heroMarquee} reverse />
      </div>

      <div
        className="absolute bottom-1 left-1/2 z-10 -translate-x-1/2 text-[9px] tracking-[0.5em] text-muted uppercase"
        data-hero-fade
      >
        scroll ↓
      </div>
    </section>
  )
}

function Kv({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-l border-paiks-yellow/30 pl-3">
      <dt className="text-[9px] tracking-[0.3em] text-muted uppercase">{k}</dt>
      <dd className="mt-1 text-xs font-semibold text-paper md:text-[13px]">{v}</dd>
    </div>
  )
}
