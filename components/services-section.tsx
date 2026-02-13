"use client"

import {
  Bot,
  CreditCard,
  BarChart3,
  Shield,
  Bell,
  Eye,
  Smartphone,
  Zap,
} from "lucide-react"

const services = [
  {
    icon: Bot,
    title: "Concierge IA 24/7",
    description:
      "Assistant intelligent propulse par OpenAI GPT-4 pour des conseils de voyage personnalises en temps reel.",
    tag: "Intelligence Artificielle",
  },
  {
    icon: Eye,
    title: "Immersion 3D",
    description:
      "Explorez les chambres et suites en realite 3D interactive avant de reserver. Format .glb optimise.",
    tag: "Experience Immersive",
  },
  {
    icon: CreditCard,
    title: "Paiement Stripe Securise",
    description:
      "Flux complet PaymentIntents avec Webhooks. Facturation automatique PDF avec cachet HSEM.",
    tag: "Paiements",
  },
  {
    icon: BarChart3,
    title: "Dashboard Partenaire",
    description:
      "Tableau de bord analytique avec graphiques financiers. Courbes Or CA et Argent statistiques.",
    tag: "Business Intelligence",
  },
  {
    icon: Bell,
    title: "Notifications Tri-Canal",
    description:
      "SMS Twilio, Email SMTP et notifications In-App pour ne jamais manquer une mise a jour.",
    tag: "Communications",
  },
  {
    icon: Shield,
    title: "Securite Premium",
    description:
      "JWT Tokens 30j, chiffrement API, logique annulation 24h et protection des donnees.",
    tag: "Securite",
  },
  {
    icon: Smartphone,
    title: "Design Mobile-First",
    description:
      "Interface responsive. Globe 3D bascule en carte HD sur mobile. Accessibilite optimale.",
    tag: "Mobile",
  },
  {
    icon: Zap,
    title: "Performance Optimisee",
    description:
      "Modeles 3D < 2Mo, skeleton screens bluetes, animations CSS haut de gamme et chargement optimise.",
    tag: "Performance",
  },
]

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative py-24"
      role="region"
      aria-label="Services et fonctionnalites"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-hsem-gold">
            Ecosysteme Complet
          </span>
          <h2 className="mb-4 font-serif text-3xl font-bold text-hsem-alabaster md:text-5xl text-balance">
            Technologie & Luxe Fusionnes
          </h2>
          <p className="mx-auto max-w-2xl text-hsem-silver/70 text-pretty">
            Une plateforme complete integrant intelligence artificielle, immersion 3D,
            paiements securises et analytics avances.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="glass-card group rounded-2xl p-6 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-hsem-gold/20 bg-hsem-gold/10 transition-colors group-hover:bg-hsem-gold/20">
                <service.icon className="h-6 w-6 text-hsem-gold" />
              </div>
              <span className="mb-2 inline-block rounded-full bg-hsem-navy/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-hsem-gold/80">
                {service.tag}
              </span>
              <h3 className="mb-2 font-serif text-lg font-bold text-hsem-alabaster">
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-hsem-silver/60">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
