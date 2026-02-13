"use client"

import { HSEMLogo } from "./hsem-logo"
import { MapPin, Phone, Mail, Globe } from "lucide-react"

const footerLinks = {
  plateforme: [
    { label: "Accueil", href: "#hero" },
    { label: "Destinations", href: "#destinations" },
    { label: "Services", href: "#services" },
    { label: "Architecture", href: "#architecture" },
  ],
  partenaires: [
    { label: "Devenir Partenaire", href: "/register" },
    { label: "Dashboard Hotelier", href: "/partner/dashboard" },
    { label: "Espace Client", href: "/client/account" },
    { label: "Connexion", href: "/login" },
    { label: "Comptes Demo", href: "/credentials" },
  ],
  legal: [
    { label: "Mentions Legales", href: "#" },
    { label: "CGU", href: "#" },
    { label: "Politique de Confidentialite", href: "#" },
    { label: "Politique d'Annulation", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-accent" role="contentinfo">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <HSEMLogo size="md" animated={false} />
              <div>
                <span className="font-serif text-xl font-bold text-primary">
                  HoteliaSEM
                </span>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Luxe & Excellence
                </p>
              </div>
            </div>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              La premiere plateforme hoteliere de luxe au Cameroun. Intelligence
              artificielle, immersion 3D et service Premium pour des experiences
              inoubliables.
            </p>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary/60" />
                Douala, Cameroun
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary/60" />
                +237 6XX XXX XXX
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary/60" />
                contact@hoteliasem.com
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">
              Plateforme
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.plateforme.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">
              Partenaires
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.partenaires.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">
              Legal
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground/70">
            2026 HoteliaSEM. Tous droits reserves. Plateforme Hoteliere de Luxe au
            Cameroun.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <Globe className="h-3.5 w-3.5" />
            Vision : IA & Immersion 3D pour l&apos;Hotellerie Africaine
          </div>
        </div>
      </div>
    </footer>
  )
}
