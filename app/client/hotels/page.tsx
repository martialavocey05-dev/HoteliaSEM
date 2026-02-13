'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/context/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HSEMLogo } from '@/components/hsem-logo'
import { ArrowLeft, MapPin, Star, Wifi, Car, UtensilsCrossed, Waves, Heart, Calendar } from 'lucide-react'
import Image from 'next/image'

const hotels = [
  {
    id: 1,
    city: "Douala",
    hotel: "Le Meridien Douala",
    image: "/images/hotel-douala.jpg",
    rating: 4.9,
    price: "85 000",
    description: "Vivez le luxe au coeur de la capitale économique. Chambres Premium avec vue panoramique sur la ville.",
    features: [
      { icon: Wifi, label: "Wi-Fi Haut Débit" },
      { icon: Car, label: "Navette Aéroport" },
      { icon: UtensilsCrossed, label: "Restaurant Gastronomique" },
    ],
  },
  {
    id: 2,
    city: "Yaoundé",
    hotel: "Hilton Yaoundé",
    image: "/images/hotel-yaounde.jpg",
    rating: 4.8,
    price: "120 000",
    description: "Élégance et raffinement dans la capitale politique. Suites spacieuses avec service personnalisé.",
    features: [
      { icon: Wifi, label: "Wi-Fi Premium" },
      { icon: Star, label: "Spa & Bien-être" },
      { icon: UtensilsCrossed, label: "Bar Lounge" },
    ],
  },
  {
    id: 3,
    city: "Kribi",
    hotel: "Ilomba Beach Resort",
    image: "/images/hotel-kribi.jpg",
    rating: 4.7,
    price: "95 000",
    description: "Paradis tropical au bord de l'océan. Bungalows de luxe les pieds dans le sable blanc.",
    features: [
      { icon: Waves, label: "Plage Privée" },
      { icon: Car, label: "Excursions" },
      { icon: UtensilsCrossed, label: "Cuisine Locale" },
    ],
  },
]

export default function ClientHotelsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated || user?.role !== 'client') {
      router.push('/login')
      return
    }
    
    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem('hsem_favorites')
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [isAuthenticated, isLoading, user, router])

  const toggleFavorite = (hotelId: number) => {
    const newFavorites = favorites.includes(hotelId)
      ? favorites.filter(id => id !== hotelId)
      : [...favorites, hotelId]
    
    setFavorites(newFavorites)
    localStorage.setItem('hsem_favorites', JSON.stringify(newFavorites))
  }

  const handleReserve = (hotelId: number, hotelName: string) => {
    console.log('[v0] Reserve hotel:', hotelId, hotelName)
    router.push(`/client/hotels/${hotelId}/reserve`)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <HSEMLogo size="md" animated />
          <p className="mt-4 text-hsem-gold">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'client') return null

  return (
    <div className="relative min-h-screen bg-background">
      <div className="animate-deep-sea-pulse absolute inset-0" />

      <div className="relative">
        {/* Header */}
        <header className="glass border-b border-hsem-silver/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <HSEMLogo size="sm" />
              <span className="font-serif text-xl font-bold text-hsem-gold">HoteliaSEM</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/client/account')}
              className="text-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 animate-fade-in-up">
            <h1 className="font-serif text-4xl font-bold text-hsem-gold">
              Nos Hôtels
            </h1>
            <p className="mt-2 text-foreground/70">
              Découvrez notre sélection d'établissements de luxe
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel, i) => (
              <Card
                key={hotel.id}
                className="glass-card border-hsem-silver/20 overflow-hidden animate-scale-in group"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={hotel.image}
                    alt={`${hotel.hotel} - ${hotel.city}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-hsem-navy via-transparent to-transparent" />

                  {/* City badge */}
                  <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-hsem-navy/70 px-3 py-1.5 backdrop-blur-sm">
                    <MapPin className="h-3.5 w-3.5 text-hsem-gold" />
                    <span className="text-xs font-semibold text-hsem-alabaster">
                      {hotel.city}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-hsem-gold/90 px-2.5 py-1">
                    <Star className="h-3 w-3 fill-hsem-navy text-hsem-navy" />
                    <span className="text-xs font-bold text-hsem-navy">{hotel.rating}</span>
                  </div>

                  {/* Favorite button */}
                  <button
                    onClick={() => toggleFavorite(hotel.id)}
                    className="absolute right-4 bottom-4 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-all hover:bg-background hover:scale-110"
                    aria-label={favorites.includes(hotel.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors ${
                        favorites.includes(hotel.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-foreground'
                      }`}
                    />
                  </button>
                </div>

                <CardContent className="p-6">
                  <h3 className="mb-2 font-serif text-xl font-bold text-hsem-gold">
                    {hotel.hotel}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-foreground/70">
                    {hotel.description}
                  </p>

                  {/* Features */}
                  <div className="mb-5 flex flex-wrap gap-2">
                    {hotel.features.map((feat) => (
                      <div
                        key={feat.label}
                        className="flex items-center gap-1.5 rounded-full border border-border bg-accent/40 px-3 py-1"
                      >
                        <feat.icon className="h-3 w-3 text-primary" />
                        <span className="text-[11px] text-foreground/80">{feat.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-end justify-between border-t border-border pt-4">
                    <div>
                      <span className="text-xs text-foreground/60">À partir de</span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif text-2xl font-bold text-primary">
                          {hotel.price}
                        </span>
                        <span className="text-xs text-foreground/60">XAF/nuit</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleReserve(hotel.id, hotel.hotel)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Réserver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
