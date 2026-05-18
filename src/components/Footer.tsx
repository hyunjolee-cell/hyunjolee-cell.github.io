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
        className="relative mt-14 border-t border-paiks-yellow/15 pt-7"
      >
        <p className="text-[10px] font-bold tracking-[0.42em] text-paiks-yellow uppercase">
          Downloads — 템플릿 · 결과물
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a
            href="/downloads/source-code.zip"
            download
            className="group glass-strong relative flex items-center justify-between gap-4 rounded-2xl px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-paiks-yellow md:px-6"
            style={{ boxShadow: '0 8px 24px rgba(11,21,48,0.45)' }}
          >
            <div className="flex items-center gap-4">
              <span
                className="grid size-11 place-items-center rounded-xl bg-paiks-yellow text-paiks-navy"
                style={{ boxShadow: 'var(--shadow-glow-yellow)' }}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 2v6h6V2M4 2h16v20H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M9 13h6M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-bold text-paper md:text-base">
                  소스 코드 (Template)
                </p>
                <p className="mt-0.5 text-xs text-paper/55">
                  React + Vite + Tailwind + GSAP · 풀 소스
                </p>
              </div>
            </div>
            <span className="font-mono text-[10px] tracking-[0.32em] text-paiks-yellow uppercase transition-transform group-hover:translate-x-1">
              .ZIP ↓
            </span>
          </a>

          <a
            href="/downloads/site-html.zip"
            download
            className="group glass-strong relative flex items-center justify-between gap-4 rounded-2xl px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-paiks-yellow md:px-6"
            style={{ boxShadow: '0 8px 24px rgba(11,21,48,0.45)' }}
          >
            <div className="flex items-center gap-4">
              <span
                className="grid size-11 place-items-center rounded-xl bg-paiks-navy text-paiks-yellow"
                style={{ border: '1px solid rgba(255,199,44,0.5)' }}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5h18v14H3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M3 9h18M7 14l2 2-2 2M17 14l-2 2 2 2M12 13l-2 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-bold text-paper md:text-base">
                  HTML 패키지 (Pre-built)
                </p>
                <p className="mt-0.5 text-xs text-paper/55">
                  빌드된 정적 사이트 · 바로 호스팅 가능
                </p>
              </div>
            </div>
            <span className="font-mono text-[10px] tracking-[0.32em] text-paiks-yellow uppercase transition-transform group-hover:translate-x-1">
              .ZIP ↓
            </span>
          </a>
        </div>
      </div>

      <div
        data-closing
        className="relative mt-10 border-t border-paiks-yellow/15 pt-7"
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
