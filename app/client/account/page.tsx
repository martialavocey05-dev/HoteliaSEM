'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/context/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HSEMLogo } from '@/components/hsem-logo'
import { Calendar, CreditCard, Heart, LogOut, Settings, User } from 'lucide-react'

export default function ClientAccountPage() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else if (user?.role !== 'client') {
      router.push('/')
    }
  }, [isAuthenticated, user, router])

  if (!user || user.role !== 'client') {
    return null
  }

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
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-hsem-silver/20 text-hsem-alabaster hover:bg-hsem-gold hover:text-hsem-navy"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-hsem-gold">
              Bienvenue, {user.firstName} !
            </h1>
            <p className="mt-2 text-hsem-alabaster/70">
              Gérez vos réservations et découvrez nos offres exclusives
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="glass-card border-hsem-silver/20">
              <CardHeader>
                <User className="mb-2 h-8 w-8 text-hsem-gold" />
                <CardTitle className="text-hsem-gold">Mon Profil</CardTitle>
                <CardDescription className="text-hsem-alabaster/70">
                  Gérez vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-hsem-alabaster/90">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Téléphone:</strong> {user.phone}</p>
                  <p><strong>Type:</strong> Client</p>
                </div>
                <Button className="mt-4 w-full bg-hsem-gold/10 text-hsem-gold hover:bg-hsem-gold/20">
                  <Settings className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-hsem-silver/20">
              <CardHeader>
                <Calendar className="mb-2 h-8 w-8 text-hsem-silver" />
                <CardTitle className="text-hsem-gold">Mes Réservations</CardTitle>
                <CardDescription className="text-hsem-alabaster/70">
                  Consultez vos séjours à venir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-hsem-alabaster/70">
                  Vous n'avez pas encore de réservation
                </p>
                <Button className="w-full bg-hsem-gold text-hsem-navy hover:bg-hsem-gold/90">
                  Réserver maintenant
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-hsem-silver/20">
              <CardHeader>
                <Heart className="mb-2 h-8 w-8 text-red-400" />
                <CardTitle className="text-hsem-gold">Favoris</CardTitle>
                <CardDescription className="text-hsem-alabaster/70">
                  Vos hôtels préférés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-hsem-alabaster/70">
                  Aucun favori pour le moment
                </p>
                <Button variant="outline" className="w-full border-hsem-silver/20 text-hsem-alabaster">
                  Découvrir
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-hsem-silver/20">
              <CardHeader>
                <CreditCard className="mb-2 h-8 w-8 text-hsem-silver" />
                <CardTitle className="text-hsem-gold">Moyens de paiement</CardTitle>
                <CardDescription className="text-hsem-alabaster/70">
                  Gérez vos cartes enregistrées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-hsem-alabaster/70">
                  Aucune carte enregistrée
                </p>
                <Button variant="outline" className="w-full border-hsem-silver/20 text-hsem-alabaster">
                  Ajouter une carte
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
