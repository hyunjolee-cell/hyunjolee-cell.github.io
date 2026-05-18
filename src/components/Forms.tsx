import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { formsFlow, formsUsage } from '@/data/content'
import { SectionHeader } from '@/components/SectionHeader'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Forms() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('[data-forms-step]', {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.07,
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      })
      gsap.from('[data-forms-usage]', {
        opacity: 0,
        y: 24,
        duration: 0.55,
        ease: 'expo.out',
        stagger: 0.05,
        scrollTrigger: { trigger: '#forms-usage', start: 'top 85%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      id="forms"
      className="relative isolate w-full px-6 py-20 md:px-12 md:py-28"
    >
      <SectionHeader
        no="11"
        category="Real-time Operations"
        title="Google Forms 기반"
        subtitle="실시간 현장 데이터 수집 체계"
        description="내부 · 외부 이해관계자가 동일 기준으로 실시간 진행률 확인 — 수동 보고 체계 완전 대체."
      />

      <div className="relative">
        <div
          className="absolute left-0 right-0 top-7 hidden h-px md:block"
          style={{
            background:
              'linear-gradient(90deg, transparent 4%, rgba(255,199,44,0.5) 12%, rgba(255,199,44,0.5) 88%, transparent 96%)',
          }}
          aria-hidden="true"
        />
        <ol className="relative grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7 md:gap-2.5">
          {formsFlow.map((s, i) => {
            const isFirst = i === 0
            const isLast = i === formsFlow.length - 1
            return (
              <li
                key={s.no}
                data-forms-step
                className="relative flex flex-col items-center text-center"
              >
                <span
                  className={`relative z-10 grid size-14 place-items-center rounded-full font-bold ${
                    isFirst || isLast
                      ? 'bg-paiks-yellow text-paiks-navy'
                      : 'bg-paiks-navy-deep text-paiks-yellow ring-1 ring-paiks-yellow/40'
                  }`}
                  style={
                    isFirst || isLast
                      ? { boxShadow: 'var(--shadow-glow-yellow)' }
                      : undefined
                  }
                >
                  {s.no}
                </span>
                <p className="mt-3 text-xs font-bold text-paper md:text-sm">
                  {s.t}
                </p>
                <p className="mt-1 text-[10px] text-paper/55 md:text-xs">
                  {s.sub}
                </p>
              </li>
            )
          })}
        </ol>
      </div>

      <div id="forms-usage" className="mt-14">
        <p className="mb-5 text-[10px] tracking-[0.42em] text-paiks-yellow uppercase">
          Collected Data — 활용
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-7">
          {formsUsage.map((u) => (
            <article
              key={u.t}
              data-forms-usage
              className="glass rounded-xl p-4 md:p-5"
            >
              <p className="text-sm font-bold text-paper md:text-[15px]">
                {u.t}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-paper/55 md:text-xs">
                {u.d}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
