import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { operatingHub, principles } from '@/data/content'
import { SectionHeader } from '@/components/SectionHeader'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function OperatingModel() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('[data-hub-card]', {
        opacity: 0,
        x: -30,
        duration: 0.9,
        ease: 'expo.out',
        immediateRender: false,
        scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
      })
      gsap.from('[data-hub-spoke]', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.06,
        immediateRender: false,
        scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
      })
      gsap.from('[data-principle]', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.05,
        immediateRender: false,
        scrollTrigger: { trigger: '#principles', start: 'top 92%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      id="model"
      className="relative isolate w-full px-6 py-20 md:px-12 md:py-28"
    >
      <SectionHeader
        no="03"
        category="Operating Model"
        title="기능별 전담 체계로"
        subtitle="설치 속도 + 안정화 동시 확보"
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.45fr] lg:gap-7">
        <article
          data-hub-card
          className="glass-strong relative rounded-3xl p-7 md:p-9"
          style={{ boxShadow: 'var(--shadow-glow-yellow)' }}
        >
          <p className="text-xs font-semibold tracking-[0.42em] text-paiks-yellow uppercase">
            HUB
          </p>
          <h3 className="mt-3 text-3xl font-extrabold text-paper md:text-4xl">
            {operatingHub.center.title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-paper/75 md:text-lg">
            {operatingHub.center.sub}
          </p>

          <div
            className="my-8 h-px"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,199,44,0.45), transparent)',
            }}
            aria-hidden="true"
          />

          <ul className="space-y-3.5">
            {operatingHub.spokes.map((s, i) => (
              <li
                key={s.title}
                className="flex items-center gap-3 text-sm text-paper/85 md:text-base"
              >
                <span
                  className="block size-2 shrink-0 rounded-full bg-paiks-yellow"
                  style={{ boxShadow: '0 0 10px rgba(255,199,44,0.7)' }}
                  aria-hidden="true"
                />
                <span className="font-mono text-xs font-semibold tracking-widest text-paiks-yellow">
                  N0{i + 1}
                </span>
                <span className="text-paper/35">·</span>
                <span className="truncate font-semibold text-paper">
                  {s.title}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
          {operatingHub.spokes.map((s, i) => (
            <article
              key={s.title}
              data-hub-spoke
              className="glass group relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-0.5 md:p-6"
            >
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-[10px] tracking-[0.32em] text-paiks-yellow/80 uppercase">
                  NODE 0{i + 1}
                </p>
                <span
                  className="block size-1.5 rounded-full bg-paiks-yellow/40 transition-all group-hover:bg-paiks-yellow group-hover:shadow-[0_0_10px_rgba(255,199,44,0.7)]"
                  aria-hidden="true"
                />
              </div>
              <h4 className="mt-3 text-base font-bold text-paper md:text-lg">
                {s.title}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-paper/60 md:text-sm">
                {s.sub}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div id="principles" className="mt-20 md:mt-28">
        <SectionHeader
          no="04"
          category="Operating Principles"
          title="전개 과정에서 적용한"
          subtitle="7가지 운영 원칙"
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {principles.map((p, i) => {
            const isYellow = i === 4 || i === 5 || i === 6
            return (
              <article
                key={p.no}
                data-principle
                className={`group relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-0.5 ${
                  isYellow ? 'bg-paiks-yellow text-void' : 'glass'
                }`}
              >
                <p
                  className={`font-mono text-[10px] tracking-[0.32em] uppercase ${isYellow ? 'text-void/60' : 'text-paiks-yellow/80'}`}
                >
                  {p.no}
                </p>
                <h4 className="mt-3 text-base font-extrabold md:text-lg">
                  {p.t}
                </h4>
                <p
                  className={`mt-3 text-xs leading-relaxed ${isYellow ? 'text-void/75' : 'text-paper/60'}`}
                >
                  {p.d}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
