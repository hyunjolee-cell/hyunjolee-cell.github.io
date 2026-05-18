import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { manuals, standardizationIssues } from '@/data/content'
import { SectionHeader } from '@/components/SectionHeader'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Standardization() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('[data-std-row]', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      })
      gsap.from('[data-std-manual]', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: '#std-manuals', start: 'top 85%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      id="standardization"
      className="relative isolate w-full px-6 py-20 md:px-12 md:py-28"
    >
      <SectionHeader
        no="05"
        category="Field Standardization"
        title="초기 검증 — 설치 기준과"
        subtitle="매장 사용 안내를 문서화"
        description="현장 설치 조직과 매장 사용자가 동일한 기준으로 이해할 수 있도록 산출물을 정비."
      />

      <div className="glass overflow-hidden rounded-2xl">
        <div className="grid grid-cols-[1fr_1.4fr_1.6fr_1fr] gap-0 border-b border-paiks-yellow/15 bg-paiks-navy-deep/50 px-5 py-3 text-[10px] tracking-[0.32em] text-paiks-yellow uppercase md:px-7 md:text-xs">
          <span>이슈</span>
          <span>현장 영향</span>
          <span>조치 사항</span>
          <span>결과</span>
        </div>
        {standardizationIssues.map((row) => (
          <div
            key={row.issue}
            data-std-row
            className="grid grid-cols-[1fr_1.4fr_1.6fr_1fr] gap-x-4 border-b border-paiks-yellow/8 px-5 py-5 last:border-0 md:px-7 md:py-6"
          >
            <span className="text-sm font-bold text-paper md:text-base">
              {row.issue}
            </span>
            <span className="text-xs leading-relaxed text-paper/65 md:text-sm">
              {row.field}
            </span>
            <span className="text-xs leading-relaxed text-paper/85 md:text-sm">
              {row.action}
            </span>
            <span className="text-xs font-semibold leading-relaxed text-paiks-yellow md:text-sm">
              {row.result}
            </span>
          </div>
        ))}
      </div>

      <div id="std-manuals" className="mt-10">
        <p className="mb-5 text-[10px] tracking-[0.42em] text-paiks-yellow uppercase">
          Manuals — 정비된 산출물 4종
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {manuals.map((m, i) => (
            <ManualCover key={m.title} manual={m} index={i} />
          ))}
        </div>
      </div>

      <p className="mt-8 max-w-3xl border-l-2 border-paiks-yellow pl-4 text-sm text-paper/55 leading-relaxed md:text-base">
        "개별 설명"이 아니라 "공식 문서 · 체크리스트"로 전환되었습니다.
      </p>
    </section>
  )
}

type Manual = (typeof manuals)[number]

function ManualCover({ manual, index }: { manual: Manual; index: number }) {
  const isCover = index < 3
  const yellowBg = index === 0 || index === 3
  const inkColor = yellowBg ? '#1f2e5c' : '#fffcef'
  const subColor = yellowBg ? 'rgba(31,46,92,0.7)' : 'rgba(255,252,239,0.7)'
  const accentColor = yellowBg ? '#1f2e5c' : '#ffc72c'

  return (
    <a
      data-std-manual
      href={manual.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
      style={{
        aspectRatio: '4 / 5',
        background: yellowBg
          ? 'linear-gradient(180deg, #ffd964 0%, #ffc72c 65%, #e5a100 100%)'
          : 'linear-gradient(180deg, #2a3f73 0%, #1f2e5c 65%, #142046 100%)',
        border: `1px solid ${yellowBg ? 'rgba(31,46,92,0.18)' : 'rgba(255,199,44,0.2)'}`,
        boxShadow: yellowBg
          ? '0 14px 36px rgba(255,199,44,0.22)'
          : '0 14px 36px rgba(11,21,48,0.5)',
      }}
    >
      <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-5">
        <div className="flex items-start justify-between">
          <span
            className="font-mono text-[9px] font-semibold tracking-[0.32em] uppercase"
            style={{ color: subColor }}
          >
            {manual.tag} · {manual.version}
          </span>
          <span
            className="grid size-7 place-items-center rounded-md text-[10px] font-black"
            style={{
              background: yellowBg ? '#1f2e5c' : '#ffc72c',
              color: yellowBg ? '#ffc72c' : '#1f2e5c',
            }}
          >
            0{index + 1}
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center">
          {isCover ? (
            <CoverArtwork yellowBg={yellowBg} ink={inkColor} accent={accentColor} />
          ) : (
            <CheckArtwork ink={inkColor} accent={accentColor} />
          )}
        </div>

        <div>
          <h4
            className="text-sm font-extrabold leading-tight md:text-base"
            style={{ color: inkColor }}
          >
            {manual.title}
          </h4>
          <div
            className="mt-2 flex items-center justify-between text-[9px] font-bold tracking-widest uppercase"
            style={{ color: subColor }}
          >
            <span>PAIK&apos;S COFFEE</span>
            <span
              className="flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-0.5"
            >
              VIEW PDF
              <svg
                viewBox="0 0 16 16"
                width="10"
                height="10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4h8v8M4 12L12 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}

function CoverArtwork({
  yellowBg,
  ink,
  accent,
}: {
  yellowBg: boolean
  ink: string
  accent: string
}) {
  const cupBody = yellowBg ? '#1f2e5c' : '#ffc72c'
  const cupLabel = yellowBg ? '#ffc72c' : '#1f2e5c'
  const labelText = yellowBg ? '#1f2e5c' : '#ffc72c'

  return (
    <svg
      viewBox="0 0 120 130"
      width="78%"
      height="auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.6">
        <path
          d="M52 18c2 2 2 5 0 7-2-2-2-5 0-7zM62 14c2 2 2 5 0 7-2-2-2-5 0-7zM72 18c2 2 2 5 0 7-2-2-2-5 0-7z"
          fill={accent}
        />
      </g>
      <path
        d="M30 36h60l-4 76c-.3 6-5.3 10-11.3 10H45.3c-6 0-11-4-11.3-10L30 36z"
        fill={cupBody}
      />
      <rect x="30" y="36" width="60" height="14" fill={cupLabel} />
      <text
        x="60"
        y="47"
        textAnchor="middle"
        fontFamily="Pretendard, system-ui, sans-serif"
        fontWeight="900"
        fontSize="9"
        fill={labelText}
        letterSpacing="2"
      >
        PAIK&apos;S
      </text>
      <ellipse cx="60" cy="78" rx="32" ry="18" fill={cupLabel} />
      <text
        x="60"
        y="83"
        textAnchor="middle"
        fontFamily="Pretendard, system-ui, sans-serif"
        fontWeight="900"
        fontSize="14"
        fill={labelText}
        letterSpacing="2"
      >
        COFFEE
      </text>
      <g opacity="0.55">
        <circle cx="22" cy="22" r="3" fill={ink} />
        <circle cx="100" cy="28" r="2" fill={ink} />
        <circle cx="14" cy="64" r="2.5" fill={ink} />
        <circle cx="106" cy="78" r="3" fill={ink} />
      </g>
    </svg>
  )
}

function CheckArtwork({ ink, accent }: { ink: string; accent: string }) {
  return (
    <svg
      viewBox="0 0 120 130"
      width="78%"
      height="auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="18"
        y="14"
        width="84"
        height="102"
        rx="6"
        fill="none"
        stroke={ink}
        strokeWidth="2.5"
        opacity="0.85"
      />
      <g stroke={accent} strokeWidth="3" strokeLinecap="round">
        <path d="M30 36h10M30 52h10M30 68h10M30 84h10" />
      </g>
      <g stroke={ink} strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
        <path d="M48 36h44M48 52h44M48 68h36M48 84h28" />
      </g>
      <circle cx="92" cy="100" r="14" fill={accent} />
      <path
        d="M86 100l4 4 8-8"
        stroke={ink}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
