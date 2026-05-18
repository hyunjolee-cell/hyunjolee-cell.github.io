import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { hardwareIssues, revenueModel, businessExpansion } from '@/data/content'
import { SectionHeader } from '@/components/SectionHeader'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Hardware() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('[data-hw-row]', {
        opacity: 0,
        x: -16,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      })
      gsap.from('[data-biz-step]', {
        opacity: 0,
        y: 18,
        duration: 0.55,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: '#biz-expansion', start: 'top 85%', once: true },
      })
      gsap.from('[data-rev-card]', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.07,
        scrollTrigger: { trigger: '#revenue-model', start: 'top 85%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      id="hardware"
      className="relative isolate w-full px-6 py-20 md:px-12 md:py-28"
    >
      <SectionHeader
        no="13"
        category="Hardware Response"
        title="프로그램 전환 과정에서"
        subtitle="확보한 H/W 대응 기반"
        description="프로그램 AS 중심 → H/W 판매 · 교체 · 유지보수로 확장 가능한 사업 기반 확보."
      />

      <div className="glass overflow-hidden rounded-2xl">
        <div className="grid grid-cols-[1fr_1fr_1fr_1.2fr] gap-0 border-b border-paiks-yellow/25 bg-paiks-navy-deep/55 px-5 py-4 text-sm font-extrabold tracking-[0.32em] text-paiks-yellow uppercase md:px-7 md:py-5 md:text-base">
          <span>현장 이슈</span>
          <span>사전 대응</span>
          <span>조치</span>
          <span>사업적 연결</span>
        </div>
        {hardwareIssues.map((row) => (
          <div
            key={row.issue}
            data-hw-row
            className="grid grid-cols-[1fr_1fr_1fr_1.2fr] gap-x-4 border-b border-paiks-yellow/10 px-5 py-5 last:border-0 md:px-7 md:py-6"
          >
            <span className="text-base font-bold text-paper md:text-lg">
              {row.issue}
            </span>
            <span className="text-sm leading-relaxed text-paper/75 md:text-base">
              {row.prep}
            </span>
            <span className="text-sm leading-relaxed text-paper md:text-base">
              {row.action}
            </span>
            <span className="text-sm font-bold leading-relaxed text-paiks-yellow md:text-base">
              {row.biz}
            </span>
          </div>
        ))}
      </div>

      <div id="biz-expansion" className="mt-16">
        <p className="mb-5 text-[10px] tracking-[0.42em] text-paiks-yellow uppercase">
          Business Expansion — 사업 확장 경로
        </p>
        <ol className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6">
          {businessExpansion.map((s, i) => (
            <li
              key={s.no}
              data-biz-step
              className={`relative rounded-xl p-4 ${
                i >= 4 ? 'card-yellow' : 'glass'
              }`}
            >
              <p
                className={`font-mono text-[10px] tracking-[0.32em] uppercase ${i >= 4 ? 'text-paiks-navy/60' : 'text-paiks-yellow/80'}`}
              >
                {s.no}
              </p>
              <p
                className={`mt-2 text-xs font-bold leading-tight md:text-sm ${i >= 4 ? 'text-paiks-navy' : 'text-paper'}`}
              >
                {s.t}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div id="revenue-model" className="mt-16">
        <p className="mb-5 text-[10px] tracking-[0.42em] text-paiks-yellow uppercase">
          Revenue Model — 수익화 구조
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {revenueModel.map((r, i) => (
            <article
              key={r.t}
              data-rev-card
              className={`relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1 ${i % 2 === 0 ? 'glass' : 'glass-strong'}`}
            >
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, #ffc72c, transparent)',
                }}
                aria-hidden="true"
              />
              <p className="font-mono text-[10px] tracking-[0.32em] text-paiks-yellow uppercase">
                R0{i + 1}
              </p>
              <h4 className="mt-3 text-lg font-extrabold text-paper">{r.t}</h4>
              <p className="mt-3 text-sm leading-relaxed text-paper/65">{r.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
