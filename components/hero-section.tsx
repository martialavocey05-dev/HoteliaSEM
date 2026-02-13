"use client"

import Image from "next/image"
import { HSEMLogo } from "./hsem-logo"
import { ArrowDown, Star, MapPin, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden"
      role="banner"
    >
      {/* Background */}
      <div className="absolute inset-0 animate-deep-sea-pulse" aria-hidden="true" />
      <Image
        src="/images/hero-hotel.jpg"
        alt=""
        fill
        className="object-cover opacity-25 mix-blend-overlay"
        priority
        aria-hidden="true"
      />

      {/* Overlay gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,16,32,0.7) 0%, rgba(0,31,63,0.5) 50%, rgba(0,16,32,0.9) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-24 text-center">
        {/* Logo */}
        <div className="mb-8 animate-bounce-in">
          <HSEMLogo size="xl" animated />
        </div>

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 animate-fade-in-up animate-glow-pulse">
          <Star className="h-4 w-4 text-primary animate-silver-float" />
          <span className="text-sm font-medium text-primary">
            Plateforme Hoteliere N.1 au Cameroun
          </span>
        </div>

        {/* Heading */}
        <h1
          className="mb-6 max-w-4xl font-serif text-4xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl animate-fade-in-up text-balance"
          style={{ animationDelay: "0.2s" }}
        >
          {"L'Excellence Hoteliere"}
          <span className="block text-primary">{"Redefinie"}</span>
        </h1>

        {/* Subtitle */}
        <p
          className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl animate-fade-in-up text-pretty"
          style={{ animationDelay: "0.4s" }}
        >
          Decouvrez les plus beaux etablissements du Cameroun. Intelligence artificielle,
          immersion 3D et service Premium pour une experience inoubliable.
        </p>

        {/* CTA Buttons */}
        <div
          className="mb-16 flex flex-col items-center gap-4 sm:flex-row animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <a
            href="#destinations"
            className="animate-golden-shimmer group relative flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:shadow-xl hover:shadow-primary/25 hover:scale-105"
          >
            Explorer les Destinations
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </a>
          <a
            href="#architecture"
            className="flex items-center gap-2 rounded-full border border-border px-8 py-4 text-base font-medium text-foreground transition-all hover:border-primary hover:text-primary hover:scale-105"
          >
            Voir la Proposition
          </a>
        </div>

        {/* Stats */}
        <div
          className="grid w-full max-w-3xl grid-cols-3 gap-6 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-md animate-scale-in"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="flex flex-col items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              3+
            </span>
            <span className="text-xs text-muted-foreground">Villes Couvertes</span>
          </div>
          <div className="flex flex-col items-center gap-2 border-x border-border/50">
            <Star className="h-5 w-5 text-primary" />
            <span className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              5*
            </span>
            <span className="text-xs text-muted-foreground">Hotels de Luxe</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              24/7
            </span>
            <span className="text-xs text-muted-foreground">Concierge IA</span>
          </div>
        </div>
      </div>
    </section>
  )
}
