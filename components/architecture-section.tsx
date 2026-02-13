"use client"

import { useState } from "react"
import {
  Database,
  Server,
  Globe,
  Layers,
  Monitor,
  Users,
  Building2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react"

const phases = [
  {
    id: "phase1",
    title: "Phase 1 : Fondation",
    items: [
      "Configuration SQL Server & creation des 8 tables optimisees",
      "Systeme d'authentification JWT (validite 30j)",
      "API RESTful avec FastAPI / Flask via pyodbc & SQLAlchemy",
      "Structure projet Next.js avec design system Luxe Metallique",
    ],
  },
  {
    id: "phase2",
    title: "Phase 2 : Portail Client",
    items: [
      "Landing Page Hero avec animations Deep Sea Pulse & Golden Dust",
      "Listing Hotels avec cartes Glassmorphism et Golden Hover",
      "Visionneuse chambre 3D (.glb < 2Mo) pour hotels Premium",
      "Checkout Stripe (PaymentIntents + Webhooks) avec facture PDF HSEM",
    ],
  },
  {
    id: "phase3",
    title: "Phase 3 : IA & Partenaires",
    items: [
      "Concierge IA (OpenAI GPT-3.5/4) avec interface Silver Float",
      "Dashboard Partenaire avec graphiques financiers animes",
      "Gestion media (images/videos) et moderation des chambres",
      "Notifications tri-canal (SMS Twilio, Email SMTP, In-App)",
    ],
  },
  {
    id: "phase4",
    title: "Phase 4 : Administration & Production",
    items: [
      "Panel Admin : validation hotels et suivi commissions (15%/8%)",
      "Logique annulation 24h avec remboursement automatique",
      "Optimisation performance & accessibilite mobile",
      "Tests, securite et deploiement production",
    ],
  },
]

const archLayers = [
  {
    icon: Monitor,
    label: "Frontend",
    tech: "React / Next.js",
    detail: "Pages immersives 3D, Glassmorphism, animations CSS haut de gamme",
    color: "text-hsem-gold",
  },
  {
    icon: Server,
    label: "Backend API",
    tech: "Python FastAPI",
    detail: "pyodbc, SQLAlchemy, JWT Auth, Stripe SDK, OpenAI API",
    color: "text-hsem-silver",
  },
  {
    icon: Database,
    label: "Base de Donnees",
    tech: "SQL Server",
    detail: "8 tables relationnelles, index optimises, contraintes CHECK/FK",
    color: "text-hsem-gold",
  },
  {
    icon: Globe,
    label: "Services Externes",
    tech: "Stripe, OpenAI, Twilio",
    detail: "Paiements, IA conversationnelle, SMS & Email notifications",
    color: "text-hsem-silver",
  },
]

const portals = [
  {
    icon: Users,
    title: "Portail Client",
    features: [
      "Globe 3D interactif (carte HD sur mobile)",
      "Recherche & reservation intelligente",
      "Paiement securise & facturation PDF",
      "Concierge IA personnalise",
    ],
  },
  {
    icon: Building2,
    title: "Espace Partenaire",
    features: [
      "Dashboard analytique financier",
      "Gestion chambres & medias",
      "Suivi reservations en temps reel",
      "Statistiques de performance",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Administration",
    features: [
      "Validation nouveaux hotels",
      "Commissions 15% Standard / 8% Premium",
      "Moderation & gestion utilisateurs",
      "Monitoring plateforme global",
    ],
  },
]

export function ArchitectureSection() {
  const [activePhase, setActivePhase] = useState("phase1")

  return (
    <section
      id="architecture"
      className="relative py-24"
      role="region"
      aria-label="Architecture technique et plan de developpement"
    >
      <div className="absolute inset-0 animate-deep-sea-pulse opacity-30" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-hsem-gold">
            Proposition Technique
          </span>
          <h2 className="mb-4 font-serif text-3xl font-bold text-hsem-alabaster md:text-5xl text-balance">
            Architecture & Plan de Developpement
          </h2>
          <p className="mx-auto max-w-2xl text-hsem-silver/70 text-pretty">
            Une architecture modulaire concue pour la scalabilite, la performance et
            l&apos;experience utilisateur de luxe.
          </p>
        </div>

        {/* Architecture Layers */}
        <div className="mb-20">
          <h3 className="mb-8 text-center font-serif text-2xl font-bold text-hsem-alabaster">
            Couches Architecturales
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {archLayers.map((layer, i) => (
              <div
                key={layer.label}
                className="glass-card rounded-2xl p-6 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <layer.icon className={`mb-3 h-8 w-8 ${layer.color}`} />
                <h4 className="font-serif text-lg font-bold text-hsem-alabaster">
                  {layer.label}
                </h4>
                <p className="mb-2 text-sm font-semibold text-hsem-gold">{layer.tech}</p>
                <p className="text-xs leading-relaxed text-hsem-silver/60">{layer.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Portals */}
        <div className="mb-20">
          <h3 className="mb-8 text-center font-serif text-2xl font-bold text-hsem-alabaster">
            Trois Portails Distincts
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {portals.map((portal, i) => (
              <div
                key={portal.title}
                className="glass-card rounded-2xl p-6 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-hsem-gold/10">
                  <portal.icon className="h-6 w-6 text-hsem-gold" />
                </div>
                <h4 className="mb-4 font-serif text-xl font-bold text-hsem-alabaster">
                  {portal.title}
                </h4>
                <ul className="flex flex-col gap-2.5" role="list">
                  {portal.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-hsem-silver/70"
                    >
                      <ChevronRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-hsem-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Development Phases */}
        <div>
          <h3 className="mb-8 text-center font-serif text-2xl font-bold text-hsem-alabaster">
            Plan de Developpement en 4 Phases
          </h3>

          {/* Phase tabs */}
          <div className="mb-8 flex flex-wrap justify-center gap-3" role="tablist">
            {phases.map((phase) => (
              <button
                key={phase.id}
                role="tab"
                aria-selected={activePhase === phase.id}
                aria-controls={`panel-${phase.id}`}
                onClick={() => setActivePhase(phase.id)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  activePhase === phase.id
                    ? "bg-hsem-gold text-hsem-navy shadow-lg shadow-hsem-gold/20"
                    : "border border-hsem-silver/20 text-hsem-silver/70 hover:border-hsem-gold/40 hover:text-hsem-gold"
                }`}
              >
                {phase.title}
              </button>
            ))}
          </div>

          {/* Phase content */}
          {phases.map((phase) => (
            <div
              key={phase.id}
              id={`panel-${phase.id}`}
              role="tabpanel"
              aria-labelledby={phase.id}
              hidden={activePhase !== phase.id}
              className="glass-card mx-auto max-w-3xl rounded-2xl p-8"
            >
              <h4 className="mb-6 font-serif text-xl font-bold text-hsem-gold">
                {phase.title}
              </h4>
              <div className="flex flex-col gap-4">
                {phase.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-hsem-gold/15 text-sm font-bold text-hsem-gold">
                      {idx + 1}
                    </div>
                    <p className="pt-1 text-sm leading-relaxed text-hsem-silver/80">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Layers icon */}
        <div className="mt-12 flex justify-center">
          <Layers className="h-8 w-8 animate-silver-float text-hsem-silver/40" />
        </div>
      </div>
    </section>
  )
}
