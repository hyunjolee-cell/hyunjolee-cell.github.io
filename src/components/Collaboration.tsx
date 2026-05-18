import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  collaborationInternal,
  collaborationExternal,
  meetingAgenda,
} from '@/data/content'
import { SectionHeader } from '@/components/SectionHeader'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Collaboration() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('[data-collab-item]', {
        opacity: 0,
        x: -20,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      })
      gsap.from('[data-agenda]', {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: 'expo.out',
        stagger: 0.05,
        scrollTrigger: { trigger: '#agenda', start: 'top 90%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      id="collaboration"
      className="relative isolate w-full px-6 py-20 md:px-12 md:py-28"
    >
      <SectionHeader
        no="15"
        category="Collaboration Structure"
        title="내부 4조직 · 외부 3기관"
        subtitle="협업 구조 및 주 1회 정기회의"
        description="발주처(더본코리아 IT팀) · DSI(VAN 대리점) · 스마트로와 비버웍스 내부 4조직이 한 흐름으로 운영."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-7">
        <article className="glass rounded-2xl p-6 md:p-8">
          <p className="text-[10px] tracking-[0.42em] text-paiks-yellow uppercase">
            Internal · 비버웍스 4개 조직
          </p>
          <div
            className="my-5 h-px"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,199,44,0.4), transparent)',
            }}
            aria-hidden="true"
          />
          <ul className="space-y-3">
            {collaborationInternal.map((c) => (
              <li
                key={c.t}
                data-collab-item
                className="rounded-xl border border-paiks-yellow/15 bg-paiks-navy-deep/45 px-5 py-4"
              >
                <p className="text-base font-bold text-paper">{c.t}</p>
                <p className="mt-1 text-xs text-paper/55 md:text-sm">{c.d}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="glass-strong rounded-2xl p-6 md:p-8">
          <p className="text-[10px] tracking-[0.42em] text-paiks-yellow uppercase">
            External · 외부 3기관
          </p>
          <div
            className="my-5 h-px"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,199,44,0.4), transparent)',
            }}
            aria-hidden="true"
          />
          <ul className="space-y-3">
            {collaborationExternal.map((c) => (
              <li
                key={c.t}
                data-collab-item
                className={`relative overflow-hidden rounded-xl px-5 py-4 ${
                  c.isClient
                    ? 'card-yellow'
                    : 'border border-paiks-yellow/15 bg-paiks-navy-deep/45'
                }`}
                style={
                  c.isClient
                    ? { boxShadow: 'var(--shadow-glow-yellow)' }
                    : undefined
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <p
                    className={`text-base font-bold ${c.isClient ? 'text-paiks-navy' : 'text-paper'}`}
                  >
                    {c.t}
                  </p>
                  {c.isClient ? (
                    <span className="rounded-full bg-paiks-navy/15 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-paiks-navy uppercase">
                      Client
                    </span>
                  ) : null}
                </div>
                <p
                  className={`mt-1 text-xs md:text-sm ${c.isClient ? 'text-paiks-navy/75' : 'text-paper/55'}`}
                >
                  {c.d}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div id="agenda" className="mt-10">
        <p className="mb-4 text-[10px] tracking-[0.42em] text-paiks-yellow uppercase">
          주 1회 정기회의 안건
        </p>
        <div className="flex flex-wrap gap-2">
          {meetingAgenda.map((a) => (
            <span
              key={a}
              data-agenda
              className="rounded-full border border-paiks-yellow/35 bg-paiks-yellow/10 px-4 py-2 text-xs font-medium text-paiks-yellow md:text-sm"
            >
              # {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
