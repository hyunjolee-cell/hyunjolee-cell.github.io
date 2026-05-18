import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projectDefinition, roleDefinition } from '@/data/content'
import { SectionHeader } from '@/components/SectionHeader'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Kickoff() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('[data-kickoff-row]', {
        opacity: 0,
        x: -16,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.05,
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      })
      gsap.from('[data-kickoff-result]', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 65%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      id="kickoff"
      className="relative isolate w-full px-6 py-20 md:px-12 md:py-28"
    >
      <SectionHeader
        no="03"
        category="Project Kickoff"
        title="프로젝트 착수 배경 및 초기 운영 조건"
        subtitle="— 프로젝트 정의 · 역할 정의 · 기대 결과"
        inline
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-7">
        <article className="glass rounded-2xl p-6 md:p-7">
          <p className="text-[10px] tracking-[0.42em] text-paiks-yellow uppercase">
            Project Definition
          </p>
          <div
            className="my-5 h-px"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,199,44,0.4), transparent)',
            }}
            aria-hidden="true"
          />
          <dl className="space-y-3.5">
            {projectDefinition.map((row) => (
              <div
                key={row.label}
                data-kickoff-row
                className="grid grid-cols-[80px_1fr] items-baseline gap-4 md:grid-cols-[96px_1fr]"
              >
                <dt className="inline-flex shrink-0 items-center justify-center rounded-md bg-paiks-yellow/10 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-paiks-yellow">
                  {row.label}
                </dt>
                <dd className="text-sm leading-relaxed text-paper/85 md:text-[15px]">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="glass-strong rounded-2xl p-6 md:p-7">
          <p className="text-[10px] tracking-[0.42em] text-paiks-yellow uppercase">
            Role Definition
          </p>
          <div
            className="my-5 h-px"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,199,44,0.4), transparent)',
            }}
            aria-hidden="true"
          />
          <ul className="space-y-3.5">
            {roleDefinition.map((row) => (
              <li
                key={row.label}
                data-kickoff-row
                className="grid grid-cols-[110px_1fr] items-baseline gap-4 md:grid-cols-[130px_1fr]"
              >
                <span className="flex shrink-0 items-center gap-2">
                  <span
                    className="block size-1.5 rounded-full bg-paiks-yellow"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-bold text-paper">{row.label}</span>
                </span>
                <span className="text-sm leading-relaxed text-paper/65 md:text-[15px]">
                  {row.value}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <article
        data-kickoff-result
        className="card-yellow mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl px-6 py-5 md:px-8"
        style={{ boxShadow: 'var(--shadow-glow-yellow)' }}
      >
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold tracking-[0.4em] text-paiks-navy/65 uppercase">
            Result
          </span>
          <span className="text-base font-bold text-paiks-navy md:text-lg">
            빽다방 1,870개 전환 완료 → 더본 외식 브랜드 후속 전개 기반 확보
          </span>
        </div>
        <span className="text-xs font-bold tracking-wider text-paiks-navy/70">
          ↗ NEXT
        </span>
      </article>
    </section>
  )
}
