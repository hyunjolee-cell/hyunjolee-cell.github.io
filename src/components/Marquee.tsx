type MarqueeProps = {
  items: readonly string[]
  reverse?: boolean
  className?: string
}

export function Marquee({ items, reverse = false, className = '' }: MarqueeProps) {
  const stream = [...items, ...items]
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`marquee-track ${reverse ? 'reverse' : ''}`}>
        {stream.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-8 font-extrabold tracking-tighter"
            style={{ fontSize: 'clamp(1.25rem, 3.5vw, 3rem)' }}
          >
            <span className="text-paper/0 [-webkit-text-stroke:1px_rgba(255,199,44,0.5)] transition-colors hover:text-neon-yellow">
              {item}
            </span>
            <span
              className="inline-block size-2 rounded-full bg-paiks-yellow shrink-0"
              style={{ boxShadow: 'var(--shadow-glow-yellow)' }}
              aria-hidden="true"
            />
          </span>
        ))}
      </div>
    </div>
  )
}
