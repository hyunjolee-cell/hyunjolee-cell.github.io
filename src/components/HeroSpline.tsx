import { lazy, Suspense, useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const Spline = lazy(() => import('@splinetool/react-spline'))

const SPLINE_URL = (import.meta.env.VITE_SPLINE_URL as string | undefined) ?? ''
const MASCOT_SRC = '/paiks-mascot.png'

export function HeroSpline() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  if (SPLINE_URL && !isMobile && !prefersReducedMotion) {
    return (
      <Suspense fallback={<PaiksDisc loading />}>
        <div className="absolute inset-0 [&_canvas]:!h-full [&_canvas]:!w-full">
          <Spline scene={SPLINE_URL} />
        </div>
      </Suspense>
    )
  }

  return <PaiksDisc />
}

function PaiksDisc({ loading = false }: { loading?: boolean }) {
  const [imgOk, setImgOk] = useState<boolean | null>(null)

  const hasImage = imgOk === true

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-[12%] rounded-full float-y overflow-hidden grid place-items-center"
        style={{
          background: hasImage
            ? '#0b1530'
            : 'radial-gradient(circle at 35% 28%, #ffe488 0%, #ffd55a 22%, #ffc72c 50%, #d8930b 78%, #6b4400 100%)',
          boxShadow: hasImage
            ? '0 0 50px rgba(255,199,44,0.4), 0 0 120px rgba(255,199,44,0.22)'
            : '0 0 60px rgba(255,199,44,0.45), 0 0 140px rgba(255,199,44,0.22), inset 0 -28px 60px rgba(0,0,0,0.5), inset 0 12px 26px rgba(255,255,255,0.18)',
        }}
      >
        {imgOk !== false ? (
          <img
            src={MASCOT_SRC}
            alt="PAIK'S COFFEE"
            className="absolute inset-0 h-full w-full transition-opacity duration-500"
            style={{
              opacity: hasImage ? 1 : 0,
              objectFit: 'cover',
              objectPosition: 'center',
              transform: 'scale(1.18)',
            }}
            onLoad={() => setImgOk(true)}
            onError={() => setImgOk(false)}
          />
        ) : null}

        {imgOk !== true ? (
          <div className="relative z-10 grid place-items-center">
            <span
              className="select-none font-black leading-none text-paiks-navy-deep"
              style={{
                fontSize: 'clamp(5rem, 14vw, 11rem)',
                textShadow: '0 6px 18px rgba(20, 32, 70, 0.4)',
              }}
            >
              B
            </span>
            <span
              className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-[0.42em] text-paiks-navy-deep/85 uppercase md:text-xs"
            >
              PAIK'S COFFEE
            </span>
          </div>
        ) : null}
      </div>

      <div
        className="pointer-events-none absolute top-[6%] right-[8%] size-12 rounded-full bg-paiks-yellow/35 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[12%] left-[6%] size-16 rounded-full bg-paiks-yellow/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(closest-side, transparent 60%, rgba(255,199,44,0.08) 76%, transparent 100%)',
        }}
      />
      {loading ? (
        <div className="absolute inset-x-0 bottom-1 text-center text-[10px] tracking-widest text-paiks-yellow/70 uppercase">
          loading 3D…
        </div>
      ) : null}
    </div>
  )
}
