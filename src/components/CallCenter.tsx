import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { responseRate, callCenterKpi, monthlyInstall } from '@/data/content'
import { SectionHeader } from '@/components/SectionHeader'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const maxRate = 100

export function CallCenter() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('[data-bar-rate]', {
        scaleY: 0,
        transformOrigin: 'bottom',
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.06,
        immediateRender: false,
        scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
      })
      gsap.from('[data-bar-install]', {
        scaleY: 0,
        transformOrigin: 'bottom',
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.06,
        immediateRender: false,
        scrollTrigger: { trigger: '#installs', start: 'top 92%', once: true },
      })
      gsap.from('[data-kpi]', {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.08,
        immediateRender: false,
        scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
      })
    },
    { scope: ref },
  )

  const installMax = Math.max(...monthlyInstall.map((m) => m.v))

  return (
    <section
      ref={ref}
      id="callcenter"
      className="relative isolate w-full px-6 py-20 md:px-12 md:py-28"
    >
      <div className="absolute inset-0 dot-bg opacity-25" aria-hidden="true" />

      <div className="relative">
        <SectionHeader
          no="05"
          category="Call Center Operations"
          title="CS 응대율 25% → 80%+"
          subtitle="회복 곡선"
          description="설치 D+0~2 구간 평균 4콜 발생 · 외주 6명 투입 → 80%+ 회복."
        />
      </div>

      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass rounded-2xl p-6 md:p-8">
          <div className="mb-20 flex items-center justify-between md:mb-24">
            <h3 className="text-sm font-semibold tracking-widest text-paper uppercase">
              CS 응대율 추이 (%) · 월별 콜 인입
            </h3>
            <span className="rounded-full bg-paiks-yellow px-3 py-1 text-[10px] font-bold tracking-widest text-void uppercase">
              ↑ 26/04 회복
            </span>
          </div>

          <div className="grid grid-cols-8 items-end gap-2 h-[22rem] md:h-[26rem]">
            {responseRate.map((d) => {
              const h = (d.v / maxRate) * 100
              const isMin = d.v <= 25
              const isMax = d.v >= 80
              return (
                <div
                  key={d.m}
                  className="flex h-full flex-col items-center gap-2"
                >
                  <div className="relative flex-1 w-full flex items-end">
                    <div
                      data-bar-rate
                      className="w-full min-h-[6px] rounded-t-md transition-all"
                      style={{
                        height: `${h}%`,
                        background: isMax
                          ? 'linear-gradient(180deg, #ffe34d, #ffc72c)'
                          : isMin
                            ? 'rgba(255, 199, 44, 0.22)'
                            : 'linear-gradient(180deg, rgba(255,199,44,0.7), rgba(31,46,92,0.55))',
                        boxShadow: isMax ? 'var(--shadow-glow-yellow)' : 'none',
                      }}
                    />
                    <div className="pointer-events-none absolute inset-x-0 -top-12 flex flex-col items-center md:-top-14">
                      <span
                        className={`font-black tabular-nums tracking-tighter ${
                          isMax
                            ? 'text-neon-yellow glow-yellow'
                            : isMin
                              ? 'text-paiks-yellow'
                              : 'text-paper'
                        }`}
                        style={{
                          fontSize: 'clamp(1.5rem, 2.4vw, 2.25rem)',
                          lineHeight: 1,
                        }}
                      >
                        {d.v}
                        <span
                          className={`text-sm font-bold ${
                            isMax ? 'text-neon-yellow/80' : 'text-paper/55'
                          }`}
                        >
                          %
                        </span>
                      </span>
                      <span
                        className={`mt-1 font-mono text-[10px] font-semibold tabular-nums tracking-widest uppercase md:text-xs ${
                          isMax ? 'text-paiks-yellow' : 'text-paper/45'
                        }`}
                      >
                        {d.calls.toLocaleString()} calls
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider text-paper/75 uppercase md:text-xs">
                    {d.m}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          {callCenterKpi.map((k, i) => (
            <article
              key={k.k}
              data-kpi
              className={`relative overflow-hidden rounded-2xl p-5 md:p-6 ${i === 3 ? 'card-yellow' : 'glass'}`}
              style={
                i === 3 ? { boxShadow: 'var(--shadow-glow-yellow)' } : undefined
              }
            >
              <p
                className={`font-mono text-[11px] font-semibold tracking-[0.32em] uppercase ${i === 3 ? 'text-paiks-navy/65' : 'text-paiks-yellow'}`}
              >
                {k.k}
              </p>
              <p
                className={`mt-3 font-black tracking-tight ${i === 3 ? 'text-paiks-navy' : 'text-paper'}`}
                style={{ fontSize: 'clamp(2.25rem, 3.5vw, 3rem)', lineHeight: 1 }}
              >
                {k.v}
              </p>
              <p
                className={`mt-3 text-sm font-medium ${i === 3 ? 'text-paiks-navy/75' : 'text-paper/65'}`}
              >
                {k.label}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div id="installs" className="relative mt-20">
        <SectionHeader
          no="06"
          category="Installation Results"
          title="8개월 전개 타임라인"
          subtitle="— 월별 설치 규모 · SETUP · FIX · MASS · PEAK · LANDING"
          inline
        />
      </div>
      <div className="mt-2">

        <div className="glass rounded-2xl p-6 pt-20 md:p-8 md:pt-24">
          <div className="grid grid-cols-8 items-end gap-2 h-[22rem] md:h-[30rem]">
            {monthlyInstall.map((d) => {
              const h = (d.v / installMax) * 100
              const isPeak = d.phase === 'PEAK'
              return (
                <div
                  key={d.m}
                  className="flex h-full flex-col items-center gap-2"
                >
                  <div className="relative flex-1 w-full flex items-end">
                    <div
                      data-bar-install
                      className="w-full min-h-[6px] rounded-t-md"
                      style={{
                        height: `${h}%`,
                        background: isPeak
                          ? 'linear-gradient(180deg, #ffe34d, #ffc72c)'
                          : 'linear-gradient(180deg, rgba(255,199,44,0.55), rgba(31,46,92,0.55))',
                        boxShadow: isPeak ? 'var(--shadow-glow-yellow)' : 'none',
                      }}
                    />
                    <span
                      className={`pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 font-black tabular-nums tracking-tighter md:-top-14 ${
                        isPeak ? 'text-neon-yellow glow-yellow' : 'text-paper'
                      }`}
                      style={{
                        fontSize: 'clamp(1.5rem, 2.4vw, 2.25rem)',
                        lineHeight: 1,
                      }}
                    >
                      {d.v.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider text-paper/75 uppercase md:text-xs">
                    {d.m}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
