import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { stats } from '@/data/content'
import { SectionHeader } from '@/components/SectionHeader'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const accentClass: Record<(typeof stats)[number]['accent'], string> = {
  yellow: 'text-neon-yellow glow-yellow',
  cyan: 'text-neon-cyan glow-cyan',
  magenta: 'text-neon-magenta glow-magenta',
  paper: 'text-paper',
}

export function Stats() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('[data-stat-card]', {
        opacity: 0,
        y: 60,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      id="stats"
      className="relative isolate w-full px-6 py-20 md:px-12 md:py-28"
    >
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />

      <div className="relative">
        <SectionHeader
          no="01"
          category="Project Overview"
          title="프로그램 교체로 시작"
          subtitle="발주처 신뢰와 후속 사업 기반까지"
          description="단순 설치 수수료 구조를 넘어 외식 프랜차이즈 IT 운영 사업으로 확장한 프로젝트."
        />
      </div>

      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.k} {...s} />
        ))}
      </div>
    </section>
  )
}

function StatCard({
  k,
  v,
  label,
  accent,
}: (typeof stats)[number]) {
  return (
    <article
      data-stat-card
      className="glass group relative overflow-hidden rounded-2xl p-6 md:p-7 transition-all duration-500 hover:-translate-y-1"
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            accent === 'cyan'
              ? 'linear-gradient(90deg, transparent, #00f0ff, transparent)'
              : accent === 'magenta'
                ? 'linear-gradient(90deg, transparent, #ff2bd6, transparent)'
                : 'linear-gradient(90deg, transparent, #ffc72c, transparent)',
        }}
        aria-hidden="true"
      />
      <p className="text-[10px] tracking-[0.4em] text-muted uppercase">{label}</p>
      <p
        className={`mt-4 font-extrabold tracking-tighter ${accentClass[accent]}`}
        style={{ fontSize: 'clamp(2.75rem, 5vw, 4.5rem)', lineHeight: 1 }}
      >
        <Counter to={v} />
      </p>
      <p className="mt-6 text-xs tracking-[0.3em] text-muted uppercase">{k}</p>
    </article>
  )
}

function Counter({ to }: { to: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(to)

  useEffect(() => {
    const match = to.match(/^([\d,]+)(.*)$/)
    if (!match) {
      setDisplay(to)
      return
    }
    const num = parseInt(match[1].replace(/,/g, ''), 10)
    const suffix = match[2] ?? ''
    if (!Number.isFinite(num)) {
      setDisplay(to)
      return
    }

    const node = ref.current
    if (!node) return

    let trigger: ScrollTrigger | null = null
    trigger = ScrollTrigger.create({
      trigger: node,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const obj = { n: 0 }
        gsap.to(obj, {
          n: num,
          duration: 1.6,
          ease: 'expo.out',
          onUpdate: () => {
            setDisplay(`${Math.round(obj.n).toLocaleString('en-US')}${suffix}`)
          },
        })
      },
    })

    return () => {
      trigger?.kill()
    }
  }, [to])

  return <span ref={ref}>{display}</span>
}
