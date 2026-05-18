import { SmoothScroll } from '@/components/SmoothScroll'
import { Hero } from '@/components/Hero'
import { Stats } from '@/components/Stats'
import { Kickoff } from '@/components/Kickoff'
import { Timeline } from '@/components/Timeline'
import { Standardization } from '@/components/Standardization'
import { Partners } from '@/components/Partners'
import { OperatingModel } from '@/components/OperatingModel'
import { CallCenter } from '@/components/CallCenter'
import { CenterSupport } from '@/components/CenterSupport'
import { Forms } from '@/components/Forms'
import { VCAT } from '@/components/VCAT'
import { Hardware } from '@/components/Hardware'
import { Showcase } from '@/components/Showcase'
import { Collaboration } from '@/components/Collaboration'
import { BrandExpansion } from '@/components/BrandExpansion'
import { Footer } from '@/components/Footer'

export default function App() {
  return (
    <SmoothScroll>
      <main className="relative min-h-svh w-full bg-void text-paper">
        <Hero />
        <SectionDivider />
        <Stats />
        <SectionDivider />
        <Kickoff />
        <SectionDivider />
        <Timeline />
        <SectionDivider />
        <Standardization />
        <SectionDivider />
        <Partners />
        <SectionDivider />
        <OperatingModel />
        <SectionDivider />
        <CallCenter />
        <SectionDivider />
        <CenterSupport />
        <SectionDivider />
        <Forms />
        <SectionDivider />
        <VCAT />
        <SectionDivider />
        <Hardware />
        <SectionDivider />
        <Showcase />
        <SectionDivider />
        <Collaboration />
        <SectionDivider />
        <BrandExpansion />
        <SectionDivider />
        <Footer />
      </main>
    </SmoothScroll>
  )
}

function SectionDivider() {
  return (
    <div className="relative mx-auto w-full max-w-7xl px-6 md:px-12">
      <div className="divider-grad" />
    </div>
  )
}
