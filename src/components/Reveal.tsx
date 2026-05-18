import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { CSSProperties, ReactNode } from 'react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Props = {
  children: ReactNode
  delay?: number
  y?: number
  stagger?: string
  className?: string
  as?: 'div' | 'section' | 'article'
  style?: CSSProperties
  id?: string
}

export function Reveal({
  children,
  delay = 0,
  y = 40,
  stagger,
  className = '',
  as = 'div',
  style,
  id,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const targets = stagger
        ? ref.current!.querySelectorAll(stagger)
        : [ref.current!]
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 1,
        ease: 'expo.out',
        delay,
        stagger: stagger ? 0.08 : 0,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          once: true,
        },
      })
    },
    { scope: ref },
  )

  const Tag = as
  return (
    <Tag ref={ref as never} id={id} className={className} style={style}>
      {children}
    </Tag>
  )
}
