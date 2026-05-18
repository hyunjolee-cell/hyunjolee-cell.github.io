import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { expansionBrands, verifiedModel } from '@/data/content'
import { SectionHeader } from '@/components/SectionHeader'
import type { ExpansionBrand } from '@/data/content'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const PAIKS_LOGO = '/brands/paiks.png'

const expansionStages = [
  {
    no: '01',
    tag: 'DONE',
    title: 'PAIK’S COFFEE',
    sub: '1,870개 매장 전환 완료',
    note: '운영 체계 · 안정화 · 자동화 검증',
    tone: 'done' as const,
  },
  {
    no: '02',
    tag: 'PROVEN',
    title: '빽다방 CS',
    sub: '콜센터 위탁 · 응대율 80%+ 회복',
    note: '7,520콜 · 외주 6명 운영 모델',
    tone: 'proven' as const,
  },
  {
    no: '03',
    tag: 'PROVEN',
    title: '빽다방 H/W AS',
    sub: 'H/W AS · 장비 교체 · 유지보수',
    note: 'POS · 키오스크 · 공유기 · SSD',
    tone: 'proven' as const,
  },
  {
    no: '04',
    tag: 'NEXT',
    title: '외식 브랜드 확장',
    sub: '약 1,000+ 매장 후속 전개',
    note: '빽보이 · 새마을 · 홍콩반점 …',
    tone: 'next' as const,
  },
]

export function BrandExpansion() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('[data-model-item]', {
        opacity: 0,
        x: -16,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.06,
        immediateRender: false,
        scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
      })

      gsap.from('[data-stage]', {
        opacity: 0,
        y: 30,
        duration: 0.75,
        ease: 'expo.out',
        stagger: 0.14,
        immediateRender: false,
        scrollTrigger: { trigger: '#stages', start: 'top 88%', once: true },
      })

      gsap.from('[data-stage-arrow]', {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.14,
        delay: 0.2,
        immediateRender: false,
        scrollTrigger: { trigger: '#stages', start: 'top 88%', once: true },
      })

      gsap.from('[data-brand-card]', {
        opacity: 0,
        y: 28,
        scale: 0.94,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.08,
        immediateRender: false,
        scrollTrigger: { trigger: '#brand-grid', start: 'top 90%', once: true },
      })

      const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
      tl.to('[data-pulse-dot]', { scale: 1.25, opacity: 0.85, duration: 1.4, stagger: 0.18 })
    },
    { scope: ref },
  )

  const visibleBrands = expansionBrands.filter((b) => b.imgSrc || b.tone === 'paiks')

  return (
    <section
      ref={ref}
      id="expansion"
      className="relative isolate w-full px-6 py-20 md:px-12 md:py-28"
    >
      <SectionHeader
        no="16"
        category="Brand Expansion"
        title="PAIK'S COFFEE에서 시작한 더본코리아 전체 외식 브랜드 확장"
        subtitle="— CS · AS · Operations 검증 모델의 후속 전개"
        inline
      />

      <article
        className="glass-strong mb-10 rounded-2xl p-7 md:p-9"
        style={{ boxShadow: 'var(--shadow-glow-yellow)' }}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.8fr] lg:gap-9">
          <div>
            <p className="text-[10px] tracking-[0.42em] text-paiks-yellow uppercase">
              Verified Model
            </p>
            <h3 className="mt-3 text-2xl font-extrabold text-paper md:text-3xl">
              PAIK&apos;S COFFEE 검증 모델
            </h3>
            <p className="mt-3 text-sm text-paper/65 leading-relaxed md:text-base">
              8개월간 1,870개 매장에서 검증된 7가지 운영 자산을 후속 브랜드에
              그대로 이식.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-3 self-center sm:grid-cols-3 lg:grid-cols-4">
            {verifiedModel.map((m) => (
              <li
                key={m}
                data-model-item
                className="flex items-center gap-2.5 text-sm md:text-base"
              >
                <span
                  data-pulse-dot
                  className="block size-2 shrink-0 rounded-full bg-paiks-yellow"
                  style={{ boxShadow: '0 0 8px rgba(255,199,44,0.7)' }}
                  aria-hidden="true"
                />
                <span className="font-semibold text-paper">{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>

      <div id="stages" className="relative mb-14">
        <p className="mb-5 text-[10px] tracking-[0.42em] text-paiks-yellow uppercase">
          Expansion Flow — 사업 확장 스토리
        </p>
        <ol className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-3">
          {expansionStages.map((s, i) => {
            const isDone = s.tone === 'done'
            const isProven = s.tone === 'proven'
            const isNext = s.tone === 'next'
            return (
              <li key={s.no} className="relative" data-stage>
                <article
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1 md:p-6 ${
                    isDone
                      ? 'card-yellow'
                      : isProven
                        ? 'glass-strong'
                        : 'glass'
                  }`}
                  style={
                    isDone
                      ? { boxShadow: 'var(--shadow-glow-yellow)' }
                      : isNext
                        ? { boxShadow: '0 12px 32px rgba(11,21,48,0.45)' }
                        : { boxShadow: '0 10px 28px rgba(11,21,48,0.45)' }
                  }
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`font-mono text-[10px] font-semibold tracking-[0.32em] uppercase ${
                        isDone ? 'text-paiks-navy/60' : 'text-paiks-yellow/80'
                      }`}
                    >
                      STAGE {s.no}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-black tracking-widest uppercase ${
                        isDone
                          ? 'bg-paiks-navy text-paiks-yellow'
                          : isProven
                            ? 'bg-paiks-yellow/20 text-paiks-yellow'
                            : 'bg-paiks-yellow text-paiks-navy'
                      }`}
                      style={isNext ? { boxShadow: '0 0 12px rgba(255,199,44,0.5)' } : undefined}
                    >
                      {s.tag}
                    </span>
                  </div>
                  <h4
                    className={`mt-5 font-extrabold leading-tight ${
                      isDone ? 'text-paiks-navy' : 'text-paper'
                    }`}
                    style={{ fontSize: 'clamp(1.05rem, 1.4vw, 1.35rem)' }}
                  >
                    {s.title}
                  </h4>
                  <p
                    className={`mt-2 text-sm ${
                      isDone ? 'text-paiks-navy/85' : 'text-paper/85'
                    }`}
                  >
                    {s.sub}
                  </p>
                  <p
                    className={`mt-auto pt-4 text-[11px] tracking-wider ${
                      isDone ? 'text-paiks-navy/60' : 'text-paper/45'
                    }`}
                  >
                    {s.note}
                  </p>
                </article>

                {i < expansionStages.length - 1 ? (
                  <span
                    data-stage-arrow
                    aria-hidden="true"
                    className="pointer-events-none absolute right-[-14px] top-1/2 hidden -translate-y-1/2 items-center md:flex"
                  >
                    <span
                      className="block h-px w-7"
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(255,199,44,0.7), rgba(255,199,44,0.3))',
                      }}
                    />
                    <svg
                      viewBox="0 0 16 16"
                      width="14"
                      height="14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="#ffc72c"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                ) : null}
              </li>
            )
          })}
        </ol>
      </div>

      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-[10px] tracking-[0.42em] text-paiks-yellow uppercase">
          Next Target — 더본코리아 외식 브랜드 후속 전개
        </p>
        <p className="text-[10px] tracking-[0.3em] text-paper/45 uppercase">
          ≈ 1,000+ stores
        </p>
      </div>

      <div
        id="brand-grid"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 md:gap-4"
      >
        <PaiksDoneCard />
        {visibleBrands
          .filter((b) => b.imgSrc)
          .map((b) => (
            <BrandCardWithImage key={b.eng + b.name} brand={b} />
          ))}
      </div>

      <p className="mt-6 text-xs text-paper/55 md:text-sm">
        * 브랜드 로고는 더본코리아의 자산입니다 · 본 화이트페이퍼는 후속 전개
        시안 목적.
      </p>
    </section>
  )
}

function PaiksDoneCard() {
  return (
    <article
      data-brand-card
      className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1"
      style={{
        background: '#fffcef',
        border: '1px solid rgba(255,199,44,0.4)',
        boxShadow:
          '0 0 24px rgba(255,199,44,0.4), 0 0 64px rgba(255,199,44,0.22)',
        aspectRatio: '1 / 1.16',
      }}
    >
      <div className="flex h-full flex-col p-4 md:p-4">
        <div className="flex items-start justify-between">
          <span className="font-mono text-[9px] font-semibold tracking-[0.32em] text-paiks-navy/65 uppercase">
            CAFE
          </span>
          <span className="rounded-full bg-paiks-navy px-2 py-0.5 text-[9px] font-black tracking-widest text-paiks-yellow uppercase">
            DONE 1,870
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center px-3 py-4">
          <img
            src={PAIKS_LOGO}
            alt="PAIK'S COFFEE"
            loading="lazy"
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.06]"
            style={{ maxHeight: '110px', mixBlendMode: 'multiply' }}
          />
        </div>

        <div className="border-t border-paiks-navy/15 pt-2.5">
          <p className="text-center text-xs font-bold text-paiks-navy md:text-sm">
            빽다방
          </p>
          <p className="mt-1 text-center font-mono text-[9px] font-semibold tracking-[0.2em] text-paiks-navy/60 uppercase">
            PAIK&apos;S COFFEE
          </p>
        </div>
      </div>
    </article>
  )
}

function BrandCardWithImage({ brand }: { brand: ExpansionBrand }) {
  return (
    <article
      data-brand-card
      className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1"
      style={{
        background: '#fffcef',
        border: '1px solid rgba(255,199,44,0.25)',
        boxShadow: '0 10px 28px rgba(11,21,48,0.45)',
        aspectRatio: '1 / 1.16',
      }}
    >
      <div className="flex h-full flex-col p-4 md:p-4">
        <div className="flex items-start justify-between">
          <span className="font-mono text-[9px] font-semibold tracking-[0.32em] text-paiks-navy/55 uppercase">
            {brand.cat}
          </span>
          <span className="rounded-full bg-paiks-navy/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-paiks-navy uppercase">
            {brand.stores}
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center px-3 py-4">
          <img
            src={brand.imgSrc}
            alt={brand.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.06]"
            style={{ maxHeight: '110px' }}
          />
        </div>

        <div className="border-t border-paiks-navy/10 pt-2.5">
          <p className="text-center text-xs font-bold text-paiks-navy md:text-sm">
            {brand.name}
          </p>
          <p className="mt-1 text-center font-mono text-[9px] font-semibold tracking-[0.2em] text-paiks-navy/45 uppercase">
            {brand.eng}
          </p>
        </div>
      </div>
    </article>
  )
}
