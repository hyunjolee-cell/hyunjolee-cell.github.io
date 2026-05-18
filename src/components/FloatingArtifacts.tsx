type Artifact = {
  kind: 'cup' | 'B' | 'star' | 'dot' | 'ring'
  x: string
  y: string
  size: number
  anim: 'drift-a' | 'drift-b' | 'drift-c' | 'float-y'
  delay: number
  opacity: number
  rotate?: number
}

const artifacts: Artifact[] = [
  { kind: 'cup', x: '8%', y: '18%', size: 56, anim: 'drift-a', delay: 0, opacity: 0.18, rotate: -8 },
  { kind: 'B', x: '92%', y: '12%', size: 44, anim: 'drift-b', delay: 1.2, opacity: 0.2, rotate: 12 },
  { kind: 'star', x: '14%', y: '70%', size: 28, anim: 'drift-c', delay: 0.4, opacity: 0.35 },
  { kind: 'ring', x: '86%', y: '64%', size: 64, anim: 'float-y', delay: 0.8, opacity: 0.16 },
  { kind: 'dot', x: '50%', y: '8%', size: 12, anim: 'drift-c', delay: 2, opacity: 0.5 },
  { kind: 'dot', x: '24%', y: '40%', size: 8, anim: 'drift-b', delay: 1.5, opacity: 0.6 },
  { kind: 'dot', x: '74%', y: '38%', size: 10, anim: 'drift-a', delay: 0.6, opacity: 0.5 },
  { kind: 'star', x: '46%', y: '78%', size: 22, anim: 'drift-b', delay: 1.8, opacity: 0.4 },
  { kind: 'cup', x: '60%', y: '24%', size: 36, anim: 'drift-c', delay: 2.4, opacity: 0.14, rotate: 15 },
]

export function FloatingArtifacts() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {artifacts.map((a, i) => (
        <span
          key={i}
          className={`absolute ${a.anim}`}
          style={{
            left: a.x,
            top: a.y,
            width: a.size,
            height: a.size,
            opacity: a.opacity,
            transform: `rotate(${a.rotate ?? 0}deg)`,
            animationDelay: `${a.delay}s`,
            willChange: 'transform',
          }}
        >
          <Glyph kind={a.kind} size={a.size} />
        </span>
      ))}
    </div>
  )
}

function Glyph({ kind, size }: { kind: Artifact['kind']; size: number }) {
  if (kind === 'cup') return <CupSVG size={size} />
  if (kind === 'B') return <BSVG size={size} />
  if (kind === 'star') return <StarSVG size={size} />
  if (kind === 'ring') return <RingSVG size={size} />
  return <DotSVG size={size} />
}

function CupSVG({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 18h36l-3 36c-.4 4-3.7 7-7.7 7H24.7c-4 0-7.3-3-7.7-7L14 18z"
        fill="#ffc72c"
      />
      <rect x="14" y="18" width="36" height="8" fill="#1f2e5c" />
      <path
        d="M32 10c2 2 2 5 0 7-2-2-2-5 0-7zM38 8c2 2 2 5 0 7-2-2-2-5 0-7zM26 8c2 2 2 5 0 7-2-2-2-5 0-7z"
        fill="#ffd964"
        opacity="0.85"
      />
    </svg>
  )
}

function BSVG({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="30" fill="#ffc72c" />
      <text
        x="32"
        y="46"
        textAnchor="middle"
        fontFamily="Pretendard, system-ui, sans-serif"
        fontWeight="900"
        fontSize="36"
        fill="#1f2e5c"
      >
        B
      </text>
    </svg>
  )
}

function StarSVG({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2l2.6 6.7L22 9l-5.5 4.6L18 21l-6-3.5L6 21l1.5-7.4L2 9l7.4-.3L12 2z"
        fill="#ffd964"
      />
    </svg>
  )
}

function RingSVG({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="32"
        cy="32"
        r="28"
        fill="none"
        stroke="#ffc72c"
        strokeWidth="2"
        strokeDasharray="4 6"
      />
    </svg>
  )
}

function DotSVG({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 12 12"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6" cy="6" r="6" fill="#ffc72c" />
    </svg>
  )
}
