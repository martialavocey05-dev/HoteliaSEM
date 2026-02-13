'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/context/auth-context'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { HSEMLogo } from '@/components/hsem-logo'
import { ArrowLeft, Calendar, Users, CreditCard, Check } from 'lucide-react'

export default function ReservationPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const hotelId = params?.id
  
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    roomType: 'standard',
    specialRequests: '',
  })

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated || user?.role !== 'client') {
      router.push('/login')
      return
    }
  }, [isAuthenticated, isLoading, user, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[v0] Reservation data:', { hotelId, ...formData })
    alert('Réservation confirmée! Vous recevrez un email de confirmation.')
    router.push('/client/account')
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
              onClick={() => router.push('/client/hotels')}
              className="text-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-8 animate-fade-in-up">
            <h1 className="font-serif text-4xl font-bold text-hsem-gold">
              Réservation
            </h1>
            <p className="mt-2 text-foreground/70">
              Complétez les informations pour finaliser votre séjour
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Reservation Form */}
            <div className="lg:col-span-2">
              <Card className="glass-card border-hsem-silver/20 animate-scale-in">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-hsem-gold">Détails de la réservation</CardTitle>
                      <CardDescription className="text-foreground/70">
                        Sélectionnez vos dates et préférences
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="checkIn" className="text-foreground">
                          Date d'arrivée
                        </Label>
                        <Input
                          id="checkIn"
                          type="date"
                          value={formData.checkIn}
                          onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                          className="bg-background/50 border-border text-foreground"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="checkOut" className="text-foreground">
                          Date de départ
                        </Label>
                        <Input
                          id="checkOut"
                          type="date"
                          value={formData.checkOut}
                          onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                          className="bg-background/50 border-border text-foreground"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guests" className="text-foreground">
                        Nombre de personnes
                      </Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-primary" />
                        <Input
                          id="guests"
                          type="number"
                          min="1"
                          max="10"
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                          className="pl-10 bg-background/50 border-border text-foreground"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="roomType" className="text-foreground">
                        Type de chambre
                      </Label>
                      <select
                        id="roomType"
                        value={formData.roomType}
                        onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                        className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-foreground"
                      >
                        <option value="standard">Chambre Standard</option>
                        <option value="deluxe">Chambre Deluxe</option>
                        <option value="suite">Suite</option>
                        <option value="presidential">Suite Présidentielle</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialRequests" className="text-foreground">
                        Demandes spéciales (optionnel)
                      </Label>
                      <textarea
                        id="specialRequests"
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                        className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-foreground min-h-[100px]"
                        placeholder="Ex: Étage élevé, vue sur la mer, lit king size..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform"
                      size="lg"
                    >
                      <Check className="mr-2 h-5 w-5" />
                      Confirmer la réservation
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="glass-card border-hsem-silver/20 sticky top-24 animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-500/10 p-3">
                      <CreditCard className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <CardTitle className="text-hsem-gold">Récapitulatif</CardTitle>
                      <CardDescription className="text-foreground/70">
                        Détails de votre séjour
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Hôtel:</span>
                      <span className="font-semibold text-foreground">Hôtel #{hotelId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Type:</span>
                      <span className="font-semibold text-foreground capitalize">{formData.roomType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Personnes:</span>
                      <span className="font-semibold text-foreground">{formData.guests}</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-foreground/70">Total estimé:</span>
                      <div className="text-right">
                        <span className="font-serif text-2xl font-bold text-primary">
                          85 000
                        </span>
                        <span className="text-xs text-foreground/60 ml-1">XAF/nuit</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <p className="text-xs text-foreground/70">
                      Le prix final sera calculé en fonction de vos dates et du type de chambre sélectionné.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
