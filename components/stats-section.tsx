"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Star, Bot } from "lucide-react"

const stats = [
  {
    icon: MapPin,
    value: "3+",
    label: "Villes Couvertes",
    description: "Douala, Yaounde, Kribi",
  },
  {
    icon: Star,
    value: "5*",
    label: "Hotels de Luxe",
    description: "Etablissements selectionnes",
  },
  {
    icon: Bot,
    value: "24/7",
    label: "Concierge IA",
    description: "Assistance permanente",
  },
]

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="relative py-16 md:py-20"
      aria-label="Statistiques HoteliaSEM"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.08), transparent 50%), radial-gradient(circle at 80% 50%, hsl(var(--primary) / 0.05), transparent 50%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Section heading */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary/70">
            HoteliaSEM en chiffres
          </p>
          <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl text-balance">
            {"L'excellence au service du voyage"}
          </h2>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`group relative flex flex-col items-center gap-4 rounded-2xl border border-border/40 bg-card/40 p-8 backdrop-blur-sm transition-all duration-700 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at center, hsl(var(--primary) / 0.06), transparent 70%)",
                }}
                aria-hidden="true"
              />

              {/* Icon */}
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>

              {/* Value */}
              <span className="relative font-serif text-4xl font-bold text-foreground md:text-5xl">
                {stat.value}
              </span>

              {/* Label and description */}
              <div className="relative text-center">
                <span className="block text-sm font-semibold text-foreground/90">
                  {stat.label}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {stat.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
