import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { vcatFlow } from '@/data/content'
import { SectionHeader } from '@/components/SectionHeader'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function VCAT() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('[data-vcat-step]', {
        opacity: 0,
        y: 22,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.07,
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      id="vcat"
      className="relative isolate w-full px-6 py-20 md:px-12 md:py-28"
    >
      <SectionHeader
        no="12"
        category="Payment Standardization"
        title="VCAT 설정 표준화"
        subtitle="결제 문의 반복을 원천 차단"
        description="VAN · VCAT 이슈를 외부 대리점 의존 → 내부 운영 기준 관리 전환."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4">
        {vcatFlow.map((s, i) => {
          const isFinal = i >= 3
          return (
            <article
              key={s.no}
              data-vcat-step
              className={`relative overflow-hidden rounded-2xl p-6 ${
                isFinal ? 'card-navy' : 'glass'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`grid size-9 place-items-center rounded-full font-bold ${
                    isFinal
                      ? 'bg-paiks-yellow text-paiks-navy'
                      : 'bg-paiks-navy-deep text-paiks-yellow ring-1 ring-paiks-yellow/40'
                  }`}
                >
                  {s.no}
                </span>
                <span className="font-mono text-[10px] tracking-[0.32em] text-paiks-yellow/80 uppercase">
                  Step
                </span>
              </div>
              <p className="mt-4 text-base font-bold text-paper md:text-lg">
                {s.t}
              </p>
            </article>
          )
        })}
      </div>

      <article
        className="card-yellow mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl px-6 py-5 md:px-8"
        style={{ boxShadow: 'var(--shadow-glow-yellow)' }}
      >
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold tracking-[0.4em] text-paiks-navy/65 uppercase">
            Result
          </span>
          <span className="text-base font-bold text-paiks-navy md:text-lg">
            결제 문의 반복 → VCAT 설정 표준화로 원천 차단 · 내부 운영 기준 관리 전환
          </span>
        </div>
      </article>
    </section>
  )
}
