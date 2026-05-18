import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  centerComparison,
  centerKpi,
  supportStructure,
  supportFlow,
} from '@/data/content'
import { SectionHeader } from '@/components/SectionHeader'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function CenterSupport() {
  const ref = useRef<HTMLElement>(null)
  const maxMetric = 100

  useGSAP(
    () => {
      gsap.from('[data-center-row]', {
        opacity: 0,
        y: 16,
        duration: 0.55,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      })
      gsap.from('[data-support-card]', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '#support', start: 'top 80%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      id="centers"
      className="relative isolate w-full px-6 py-20 md:px-12 md:py-28"
    >
      <SectionHeader
        no="09"
        category="Center Performance"
        title="내부 센터 vs 외부 협력사"
        subtitle="역량 비교 분석"
        description="내부 6개소 · 외부 14개소 · 콜발생률: 내부 2.92 / 외부 2.65 · 7일내 콜률: 내부 1.50 / 외부 1.68."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass rounded-2xl p-6 md:p-7">
          <ul className="space-y-5">
            {centerComparison.map((m) => {
              const intW = (m.internal / maxMetric) * 100
              const extW = (m.external / maxMetric) * 100
              return (
                <li key={m.metric} data-center-row>
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-paper md:text-base">
                      {m.metric} ({m.unit})
                    </span>
                    <span className="font-mono text-xs text-paper/55">
                      내부 {m.internal} · 외부 {m.external}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="w-8 text-[10px] tracking-widest text-paper/55 uppercase">
                        IN
                      </span>
                      <span className="block h-3 flex-1 overflow-hidden rounded-full bg-white/5">
                        <span
                          className="block h-full rounded-full"
                          style={{
                            width: `${intW}%`,
                            background:
                              'linear-gradient(90deg, rgba(255,199,44,0.4), rgba(31,46,92,0.7))',
                          }}
                        />
                      </span>
                      <span className="w-12 text-right text-xs font-bold text-paper/80 tabular-nums">
                        {m.internal}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 text-[10px] tracking-widest text-paiks-yellow uppercase">
                        EX
                      </span>
                      <span className="block h-3 flex-1 overflow-hidden rounded-full bg-white/5">
                        <span
                          className="block h-full rounded-full"
                          style={{
                            width: `${extW}%`,
                            background:
                              'linear-gradient(90deg, #ffd964, #ffc72c)',
                            boxShadow: 'var(--shadow-glow-yellow)',
                          }}
                        />
                      </span>
                      <span className="w-12 text-right text-xs font-bold text-paiks-yellow tabular-nums">
                        {m.external}
                      </span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          {centerKpi.map((k) => (
            <article
              key={k.k}
              data-center-row
              className="glass rounded-2xl p-5"
            >
              <p className="text-[10px] tracking-[0.32em] text-paiks-yellow uppercase">
                {k.k}
              </p>
              <p className="mt-2 text-2xl font-extrabold text-paper md:text-3xl">
                {k.v}
              </p>
              <p className="mt-1 text-[11px] text-paper/55 md:text-xs">
                {k.sub}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div id="support" className="mt-20">
        <SectionHeader
          no="10"
          category="Support Structure"
          title="협력사 대량 전개 품질 확보를 위한 TF 운영"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {supportStructure.map((s, i) => (
            <article
              key={s.role}
              data-support-card
              className={`relative overflow-hidden rounded-2xl p-7 md:p-8 ${i === 2 ? 'card-yellow' : 'card-navy'}`}
              style={
                i === 2 ? { boxShadow: 'var(--shadow-glow-yellow)' } : undefined
              }
            >
              <p
                className={`text-7xl font-black tracking-tight md:text-8xl ${i === 2 ? 'text-paiks-navy' : 'text-paiks-yellow'}`}
              >
                {s.count}
              </p>
              <h4
                className={`mt-4 text-lg font-extrabold md:text-xl ${i === 2 ? 'text-paiks-navy' : 'text-paper'}`}
              >
                {s.role}
              </h4>
              <p
                className={`mt-3 text-xs leading-relaxed md:text-sm ${i === 2 ? 'text-paiks-navy/75' : 'text-paper/65'}`}
              >
                {s.detail}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 overflow-x-auto">
          <ol className="flex min-w-max items-center gap-2 text-xs md:text-sm">
            {supportFlow.map((f, i) => (
              <li key={f} className="flex items-center gap-2">
                <span className="rounded-full border border-paiks-yellow/30 bg-paiks-navy-deep/60 px-4 py-2 font-semibold text-paper">
                  {f}
                </span>
                {i < supportFlow.length - 1 ? (
                  <span className="text-paiks-yellow">→</span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
