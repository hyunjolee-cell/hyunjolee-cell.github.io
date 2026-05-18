type Props = {
  no: string
  category: string
  title: string
  subtitle?: string
  description?: string
  inline?: boolean
}

export function SectionHeader({
  no,
  category,
  title,
  subtitle,
  description,
  inline = true,
}: Props) {
  return (
    <header
      className={`mb-10 md:mb-14 ${inline ? 'max-w-7xl' : 'max-w-3xl'}`}
    >
      <p className="text-[10px] font-medium tracking-[0.42em] text-paiks-yellow uppercase">
        {no} — {category}
      </p>
      {inline ? (
        <h2
          className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-extrabold tracking-tight text-paper"
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            lineHeight: 1.15,
          }}
        >
          <span>{title}</span>
          {subtitle ? (
            <span className="text-paper/45 font-light">{subtitle}</span>
          ) : null}
        </h2>
      ) : (
        <h2
          className="mt-3 font-extrabold tracking-tight text-paper leading-[1.15]"
          style={{ fontSize: 'clamp(1.65rem, 3.4vw, 2.75rem)' }}
        >
          {title}
          {subtitle ? (
            <span className="block text-paper/45 font-light">{subtitle}</span>
          ) : null}
        </h2>
      )}
      {description ? (
        <p className="mt-5 text-sm leading-relaxed text-paper/65 md:text-base">
          {description}
        </p>
      ) : null}
    </header>
  )
}
