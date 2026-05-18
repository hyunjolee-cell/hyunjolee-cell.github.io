import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { partners, fieldComplexity } from '@/data/content'
import { SectionHeader } from '@/components/SectionHeader'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Partners() {
  const ref = useRef<HTMLElement>(null)
  const maxV = Math.max(...partners.map((p) => p.v))

  useGSAP(
    () => {
      gsap.from('[data-partner-bar]', {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 1,
        ease: 'expo.out',
        stagger: 0.04,
        scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
      })
      gsap.from('[data-realloc]', {
        opacity: 0,
        x: 30,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top 65%', once: true },
      })
      gsap.from('[data-complex]', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.05,
        scrollTrigger: { trigger: '#complexity', start: 'top 75%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      id="partners"
      className="relative isolate w-full px-6 py-20 md:px-12 md:py-28"
    >
      <SectionHeader
        no="07"
        category="Partner Performance"
        title="협력사별 설치 실적"
        subtitle="우수 3개사 물량 재배분"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="glass rounded-2xl p-5 md:p-7">
          <ul className="flex flex-col gap-2.5">
            {partners.map((p) => {
              const w = (p.v / maxV) * 100
              return (
                <li key={p.name} className="grid grid-cols-[140px_1fr_60px] items-center gap-3 md:grid-cols-[180px_1fr_80px]">
                  <span
                    className={`truncate text-sm ${p.hot ? 'text-neon-yellow font-bold' : 'text-paper/75'}`}
                  >
                    {p.name}
                  </span>
                  <span className="block h-6 w-full rounded-md bg-white/5 overflow-hidden">
                    <span
                      data-partner-bar
                      className="block h-full rounded-md"
                      style={{
                        width: `${w}%`,
                        background: p.hot
                          ? 'linear-gradient(90deg, #ffe34d, #ffc72c)'
                          : 'linear-gradient(90deg, rgba(255,199,44,0.55), rgba(31,46,92,0.7))',
                        boxShadow: p.hot ? 'var(--shadow-glow-yellow)' : 'none',
                      }}
                    />
                  </span>
                  <span
                    className={`tabular-nums text-sm font-bold ${p.hot ? 'text-neon-yellow' : 'text-paper/80'}`}
                  >
                    {p.v}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>

        <aside className="flex flex-col gap-4">
          <p className="text-[10px] tracking-[0.4em] text-muted uppercase">
            Reallocation
          </p>
          {partners
            .filter((p) => p.hot)
            .map((p) => (
              <div
                key={p.name}
                data-realloc
                className="rounded-2xl p-5"
                style={{
                  background:
                    p.reAlloc === '+5%'
                      ? 'linear-gradient(135deg, #ffc72c, #b67d05)'
                      : 'rgba(15,30,61,0.55)',
                  border: '1px solid rgba(255,199,44,0.18)',
                  color: p.reAlloc === '+5%' ? '#050507' : '#f4f2ec',
                }}
              >
                <p className="text-sm font-bold tracking-wide">{p.name}</p>
                <p className="mt-2 text-4xl font-extrabold">{p.reAlloc}</p>
              </div>
            ))}
        </aside>
      </div>

      <div id="complexity" className="mt-20">
        <SectionHeader
          no="08"
          category="Field Complexity"
          title="현장에서 드러난"
          subtitle="실제 운영 난이도"
          description="설치 D+0~D+2 구간 설치 1개소당 평균 약 4콜 발생 · 약 2개월 잔존 · 3월 대량 전개 시 응대율 20%대 하락."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fieldComplexity.map((c) => (
            <article
              key={c.no}
              data-complex
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-paiks-yellow text-void font-bold text-sm">
                  {c.no}
                </span>
                <h4 className="text-lg font-bold">{c.t}</h4>
              </div>
              <p className="mt-4 text-sm text-paper/65 leading-relaxed">{c.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
