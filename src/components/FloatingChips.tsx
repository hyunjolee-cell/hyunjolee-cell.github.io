type Chip = {
  label: string
  tone: 'yellow' | 'cyan' | 'magenta'
  className: string
  delay: number
}

const chips: Chip[] = [
  {
    label: 'install tracking',
    tone: 'yellow',
    className: 'top-2 -right-2 md:-right-6 lg:right-0',
    delay: 0,
  },
  {
    label: 'forms dashboard',
    tone: 'cyan',
    className: '-bottom-1 right-6 md:right-10',
    delay: 0.8,
  },
  {
    label: 'CS hotline',
    tone: 'magenta',
    className: 'top-1/2 -left-3 md:-left-8 lg:-left-2 -translate-y-1/2',
    delay: 1.4,
  },
]

const tones: Record<Chip['tone'], string> = {
  yellow:
    'border-paiks-yellow/45 text-paiks-yellow shadow-[0_0_14px_rgba(255,199,44,0.3)]',
  cyan: 'border-neon-cyan/45 text-neon-cyan shadow-[0_0_14px_rgba(0,240,255,0.3)]',
  magenta:
    'border-neon-magenta/45 text-neon-magenta shadow-[0_0_14px_rgba(255,43,214,0.3)]',
}

export function FloatingChips() {
  return (
    <div
      className="pointer-events-none absolute inset-0 hidden md:block"
      aria-hidden="true"
    >
      {chips.map((c) => (
        <span
          key={c.label}
          className={`absolute glass float-y rounded-full border px-3 py-1.5 text-[10px] font-medium tracking-widest uppercase whitespace-nowrap ${tones[c.tone]} ${c.className}`}
          style={{ animationDelay: `${c.delay}s` }}
        >
          {c.label}
        </span>
      ))}
    </div>
  )
}
