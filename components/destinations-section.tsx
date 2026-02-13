"use client"

import Image from "next/image"
import { MapPin, Star, Wifi, Car, UtensilsCrossed, Waves } from "lucide-react"

const destinations = [
  {
    city: "Douala",
    hotel: "Le Meridien Douala",
    image: "/images/hotel-douala.jpg",
    rating: 4.9,
    price: "85 000",
    description:
      "Vivez le luxe au coeur de la capitale economique. Chambres Premium avec vue panoramique sur la ville.",
    features: [
      { icon: Wifi, label: "Wi-Fi Haut Debit" },
      { icon: Car, label: "Navette Aeroport" },
      { icon: UtensilsCrossed, label: "Restaurant Gastronomique" },
    ],
  },
  {
    city: "Yaounde",
    hotel: "Hilton Yaounde",
    image: "/images/hotel-yaounde.jpg",
    rating: 4.8,
    price: "120 000",
    description:
      "Elegance et raffinement dans la capitale politique. Suites spacieuses avec service personnalise.",
    features: [
      { icon: Wifi, label: "Wi-Fi Premium" },
      { icon: Star, label: "Spa & Bien-etre" },
      { icon: UtensilsCrossed, label: "Bar Lounge" },
    ],
  },
  {
    city: "Kribi",
    hotel: "Ilomba Beach Resort",
    image: "/images/hotel-kribi.jpg",
    rating: 4.7,
    price: "95 000",
    description:
      "Paradis tropical au bord de l'ocean. Bungalows de luxe les pieds dans le sable blanc.",
    features: [
      { icon: Waves, label: "Plage Privee" },
      { icon: Car, label: "Excursions" },
      { icon: UtensilsCrossed, label: "Cuisine Locale" },
    ],
  },
]

export function DestinationsSection() {
  return (
    <section id="destinations" className="relative py-24" role="region" aria-label="Destinations">
      <div className="absolute inset-0 animate-deep-sea-pulse opacity-50" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-hsem-gold">
            Destinations Exclusives
          </span>
          <h2 className="mb-4 font-serif text-3xl font-bold text-hsem-alabaster md:text-5xl text-balance">
            Les Joyaux du Cameroun
          </h2>
          <p className="mx-auto max-w-2xl text-hsem-silver/70 text-pretty">
            Explorez notre selection curatee des meilleurs etablissements dans les villes
            les plus prestigieuses du pays.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest, i) => (
            <article
              key={dest.city}
              className="glass-card group rounded-2xl overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={dest.image}
                  alt={`${dest.hotel} - ${dest.city}, Cameroun`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-hsem-navy via-transparent to-transparent" />

                {/* City badge */}
                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-hsem-navy/70 px-3 py-1.5 backdrop-blur-sm">
                  <MapPin className="h-3.5 w-3.5 text-hsem-gold" />
                  <span className="text-xs font-semibold text-hsem-alabaster">
                    {dest.city}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-hsem-gold/90 px-2.5 py-1">
                  <Star className="h-3 w-3 fill-hsem-navy text-hsem-navy" />
                  <span className="text-xs font-bold text-hsem-navy">{dest.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-2 font-serif text-xl font-bold text-hsem-alabaster">
                  {dest.hotel}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-hsem-silver/70">
                  {dest.description}
                </p>

                {/* Features */}
                <div className="mb-5 flex flex-wrap gap-2">
                  {dest.features.map((feat) => (
                    <div
                      key={feat.label}
                      className="flex items-center gap-1.5 rounded-full border border-hsem-silver/10 bg-hsem-navy/40 px-3 py-1"
                    >
                      <feat.icon className="h-3 w-3 text-hsem-gold" />
                      <span className="text-[11px] text-hsem-silver/80">{feat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Price and CTA */}
                <div className="flex items-end justify-between border-t border-hsem-silver/10 pt-4">
                  <div>
                    <span className="text-xs text-hsem-silver/60">A partir de</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-2xl font-bold text-hsem-gold">
                        {dest.price}
                      </span>
                      <span className="text-xs text-hsem-silver/60">XAF/nuit</span>
                    </div>
                  </div>
                  <button className="animate-golden-shimmer relative overflow-hidden rounded-full bg-hsem-gold px-5 py-2.5 text-sm font-bold text-hsem-navy transition-all hover:shadow-lg hover:shadow-hsem-gold/20">
                    Reserver
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
