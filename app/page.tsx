import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { DestinationsSection } from "@/components/destinations-section"
import { ServicesSection } from "@/components/services-section"
import { ArchitectureSection } from "@/components/architecture-section"
import { SQLSection } from "@/components/sql-section"
import { Footer } from "@/components/footer"
import { GoldenParticlesWrapper } from "@/components/golden-particles-wrapper"

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <GoldenParticlesWrapper />
      <Navbar />
      <HeroSection />
      <DestinationsSection />
      <ServicesSection />
      <ArchitectureSection />
      <SQLSection />
      <Footer />
    </main>
  )
}
