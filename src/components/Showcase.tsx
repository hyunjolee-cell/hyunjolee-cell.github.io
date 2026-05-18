import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { assets } from '@/data/content'
import { SectionHeader } from '@/components/SectionHeader'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const assetIcons = [
  // 0: 가이드 (book)
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" key="i0">
    <path d="M8 8h28c2.2 0 4 1.8 4 4v28c0 2.2-1.8 4-4 4H12c-2.2 0-4-1.8-4-4V8z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M14 16h20M14 22h20M14 28h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>,
  // 1: TF 지원조직 (users)
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" key="i1">
    <circle cx="18" cy="18" r="6" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="34" cy="20" r="5" stroke="currentColor" strokeWidth="2.5" />
    <path d="M6 40c0-6.6 5.4-12 12-12s12 5.4 12 12M28 40c0-5.5 4.5-10 10-10s4 0 0 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>,
  // 2: 고객센터 (phone)
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" key="i2">
    <path d="M14 6h8l4 10-6 4c2 6 6 10 12 12l4-6 10 4v8c0 2-2 4-4 4C20 42 6 28 6 10c0-2 2-4 4-4h4z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
  </svg>,
  // 3: H/W 대응 (server)
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" key="i3">
    <rect x="6" y="8" width="36" height="14" rx="3" stroke="currentColor" strokeWidth="2.5" />
    <rect x="6" y="26" width="36" height="14" rx="3" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="12" cy="15" r="2" fill="currentColor" />
    <circle cx="12" cy="33" r="2" fill="currentColor" />
    <path d="M20 15h16M20 33h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>,
  // 4: Forms 대시보드 (chart)
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" key="i4">
    <path d="M8 40V8M40 40H8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="14" y="22" width="6" height="14" fill="currentColor" />
    <rect x="24" y="14" width="6" height="22" fill="currentColor" />
    <rect x="34" y="28" width="6" height="8" fill="currentColor" />
  </svg>,
  // 5: VCAT (card)
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" key="i5">
    <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" />
    <path d="M6 18h36" stroke="currentColor" strokeWidth="2.5" />
    <path d="M14 30h6M26 30h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>,
  // 6: 정기회의 (calendar)
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" key="i6">
    <rect x="6" y="10" width="36" height="32" rx="3" stroke="currentColor" strokeWidth="2.5" />
    <path d="M6 18h36M16 6v8M32 6v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="16" cy="28" r="2" fill="currentColor" />
    <circle cx="24" cy="28" r="2" fill="currentColor" />
    <circle cx="32" cy="28" r="2" fill="currentColor" />
  </svg>,
]

export function Showcase() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('[data-asset-card]', {
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.06,
        immediateRender: false,
        scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      id="assets"
      className="relative isolate w-full px-6 py-20 md:px-12 md:py-28"
    >
      <SectionHeader
        no="09"
        category="Reusable Assets"
        title="전개 과정에서 구축된 재사용 가능한 운영 자산"
        subtitle="— 후속 브랜드 전개 기준 · 후속 사업 확장 기반"
        inline
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {assets.map((a, i) => {
          const isYellow = i === 4 || i === 5
          return (
            <article
              key={a.t}
              data-asset-card
              className={`group relative flex flex-col overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 ${
                isYellow ? 'card-yellow' : 'glass'
              }`}
              style={{ minHeight: '13rem' }}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`grid size-12 place-items-center rounded-xl ${
                    isYellow
                      ? 'bg-paiks-navy text-paiks-yellow'
                      : 'bg-paiks-yellow/10 text-paiks-yellow'
                  }`}
                >
                  {assetIcons[i]}
                </span>
                <span
                  className={`font-mono text-[10px] font-semibold tracking-[0.36em] uppercase ${
                    isYellow ? 'text-paiks-navy/60' : 'text-paiks-yellow/70'
                  }`}
                >
                  ASSET 0{i + 1}
                </span>
              </div>
              <h3
                className={`mt-5 text-lg font-extrabold leading-tight md:text-xl ${
                  isYellow ? 'text-paiks-navy' : 'text-paper'
                }`}
              >
                {a.t}
              </h3>
              <p
                className={`mt-3 flex-1 text-sm leading-relaxed ${
                  isYellow ? 'text-paiks-navy/75' : 'text-paper/65'
                }`}
              >
                {a.d}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
