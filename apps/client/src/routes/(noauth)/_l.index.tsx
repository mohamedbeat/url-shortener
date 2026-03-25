import { Features } from '@/components/landing/features'
import { Footer } from '@/components/landing/footer'
import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Pricing } from '@/components/landing/pricing'
import { TrustSignals } from '@/components/landing/trust-signals'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(noauth)/_l/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <TrustSignals />
      <Footer />
    </div>
  )
}
