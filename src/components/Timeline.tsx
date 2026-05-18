import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { timeline } from '@/data/content'
import { SectionHeader } from '@/components/SectionHeader'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Timeline() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('[data-timeline-step]', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.15,
        scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
      })
      gsap.from('[data-timeline-line]', {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 1.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 65%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      id="timeline"
      className="relative isolate w-full px-6 py-20 md:px-12 md:py-28"
    >
      <SectionHeader
        no="02"
        category="Project Flow"
        title="한 장으로 보는 이슈 · 조치 · 전환 흐름"
        inline
      />

      <div className="relative">
        <div
          data-timeline-line
          className="absolute left-0 right-0 top-12 hidden h-px md:block"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,199,44,0.5) 12%, rgba(0,240,255,0.4) 50%, rgba(255,43,214,0.4) 100%)',
          }}
          aria-hidden="true"
        />

        <ol className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-4 md:gap-4">
          {timeline.map((t, idx) => (
            <li
              key={t.phase}
              data-timeline-step
              className="relative flex h-full flex-col pt-16"
            >
              <span
                className="absolute left-0 top-6 grid size-12 place-items-center rounded-full font-bold"
                style={{
                  border: '1px solid rgba(255,199,44,0.5)',
                  color: idx === 3 ? '#1f2e5c' : '#ffc72c',
                  background: idx === 3 ? '#ffc72c' : '#0b1530',
                  boxShadow:
                    idx === 3
                      ? 'var(--shadow-glow-yellow)'
                      : 'inset 0 0 12px rgba(255,199,44,0.18)',
                }}
              >
                {t.phase}
              </span>
              <div className="glass mt-2 flex flex-1 flex-col rounded-2xl p-5">
                <p className="text-[10px] tracking-[0.4em] text-paiks-yellow uppercase">
                  {t.range}
                </p>
                <h3 className="mt-2 text-xl font-bold text-paper">{t.title}</h3>
                <p
                  className="mt-3 flex-1 text-sm text-paper/65 leading-relaxed"
                  style={{ textWrap: 'pretty', wordBreak: 'keep-all' }}
                >
                  {t.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-14 text-sm md:text-base text-paper/55 leading-relaxed border-l-2 border-paiks-yellow pl-4 max-w-3xl">
          "문제 발견 → 조치 표준화 → 운영 기능 분리"가 누적되며 대량 전개와 안정화가
          가능해진 구조입니다.
        </p>
      </div>
    </section>
  )
}
