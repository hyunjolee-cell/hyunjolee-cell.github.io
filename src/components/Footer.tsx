import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { closingLine, closingTagline, meta } from '@/data/content'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Footer() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('[data-closing]', {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
      })
      ScrollTrigger.matchMedia({
        '(min-width: 768px)': () => {
          gsap.to('[data-closing-bg]', {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          })
        },
      })
    },
    { scope: ref },
  )

  return (
    <footer
      ref={ref}
      className="relative isolate flex min-h-svh w-full flex-col justify-between overflow-hidden px-6 pt-24 pb-12 md:px-12 md:pt-32"
    >
      <div
        data-closing-bg
        className="pointer-events-none absolute inset-0 grid place-items-center"
        aria-hidden="true"
      >
        <span
          className="font-black text-paiks-yellow/[0.07] select-none"
          style={{
            fontSize: 'clamp(8rem, 32vw, 32rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
          }}
        >
          1,870
        </span>
      </div>

      <div className="relative">
        <div className="flex items-center gap-3" data-closing>
          <span
            className="grid size-11 place-items-center rounded-full bg-paiks-yellow font-black text-paiks-navy-deep"
            style={{ boxShadow: 'var(--shadow-glow-yellow)' }}
          >
            B
          </span>
          <p className="text-[11px] tracking-[0.4em] text-paiks-yellow uppercase md:text-xs">
            Closing · Whitepaper 2026
          </p>
        </div>

        <h2
          data-closing
          className="mt-7 font-black tracking-tight text-paper"
          style={{
            fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)',
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
          }}
        >
          <span className="glow-yellow text-paiks-yellow">{closingLine}</span>
        </h2>
        <p
          data-closing
          className="mt-7 max-w-none text-lg text-paper/75 md:text-xl leading-relaxed"
          style={{ wordBreak: 'keep-all' }}
        >
          {closingTagline}
        </p>

        <dl
          data-closing
          className="mt-14 grid max-w-none grid-cols-2 gap-x-10 gap-y-8 md:grid-cols-4 md:gap-x-12"
        >
          <FooterKv k="배경" v="PAIK'S COFFEE 1,870개 프로그램 교체 착수" />
          <FooterKv
            k="분석"
            v="현장 이슈 · H/W 노후화 · CS 과부하 · 협력사 편차"
          />
          <FooterKv
            k="과정"
            v="TF · 가이드화 · 데이터화 · CS 안정화 · H/W 대응"
          />
          <FooterKvHighlight
            k="성과"
            v="콜센터 위탁 · H/W AS · 비버웍스 장비 전환"
            v2="후속 브랜드 전개 기반 확보"
          />
        </dl>
      </div>

      <div
        data-closing
        className="relative mt-16 border-t border-paiks-yellow/15 pt-7"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="text-[10px] tracking-[0.42em] text-paiks-yellow uppercase">
              {meta.brand}
            </p>
            <p className="mt-2 text-sm text-paper/65 md:text-base">
              <span className="font-bold text-paper">{meta.client}</span> 발주 ·{' '}
              <span className="font-bold text-paper">{meta.vendor}</span> 수행
              · 2025.09 — 2026.04
            </p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.42em] text-paiks-yellow uppercase">
              Role
            </p>
            <p className="mt-2 text-sm text-paper/85 md:text-base">{meta.role}</p>
          </div>
          <div className="md:text-right">
            <p className="text-[10px] tracking-[0.42em] text-paiks-yellow uppercase">
              End of Whitepaper
            </p>
            <p className="mt-2 text-sm text-paper/55 md:text-base">
              © 2026 · All data based on internal records
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterKv({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-l-2 border-paiks-yellow/60 pl-4">
      <dt className="text-xs font-bold tracking-[0.4em] text-paiks-yellow uppercase md:text-sm">
        {k}
      </dt>
      <dd className="mt-3 text-[15px] font-medium text-paper leading-relaxed md:text-base">
        {v}
      </dd>
    </div>
  )
}

function FooterKvHighlight({ k, v, v2 }: { k: string; v: string; v2: string }) {
  return (
    <div className="border-l-2 border-paiks-yellow pl-4">
      <dt className="text-xs font-bold tracking-[0.4em] text-paiks-yellow uppercase md:text-sm">
        {k}
      </dt>
      <dd className="mt-3 text-[15px] font-medium text-paper leading-relaxed md:text-base">
        {v}
      </dd>
      <dd
        className="mt-1.5 text-[15px] font-extrabold leading-relaxed text-neon-yellow glow-yellow md:text-base"
      >
        {v2}
      </dd>
    </div>
  )
}
