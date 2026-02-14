'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/context/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HSEMLogo } from '@/components/hsem-logo'
import { Calendar, CreditCard, Heart, LogOut, Settings, User, Building2, Sparkles, ArrowRight } from 'lucide-react'
import { ChatbotWidget } from '@/components/chatbot-widget'

export default function ClientAccountPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('[v0] ClientAccount: Auth state', { isAuthenticated, isLoading, userRole: user?.role })
    if (isLoading) {
      return
    }
    if (!isAuthenticated) {
      console.log('[v0] ClientAccount: Not authenticated, redirecting to login')
      router.push('/login')
    } else if (user?.role !== 'client') {
      console.log('[v0] ClientAccount: Wrong role, redirecting to home')
      router.push('/')
    }
  }, [isAuthenticated, isLoading, user, router])

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
            <Card className="glass-card border-hsem-silver/20 hover:border-primary/50 transition-all duration-300 animate-scale-in group">
              <CardHeader>
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-2 group-hover:scale-110 transition-transform">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-hsem-gold">Mon Profil</CardTitle>
                <CardDescription className="text-foreground/70">
                  Gérez vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-foreground/90">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Téléphone:</strong> {user.phone}</p>
                  <p><strong>Type:</strong> Client Premium</p>
                </div>
                <Button
                  onClick={() => router.push('/client/profile')}
                  className="mt-4 w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 hover:scale-105 transition-transform"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Modifier mon profil
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-hsem-silver/20 hover:border-primary/50 transition-all duration-300 animate-scale-in group" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="rounded-full bg-blue-500/10 p-3 w-fit mb-2 group-hover:scale-110 transition-transform">
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle className="text-hsem-gold">Mes Réservations</CardTitle>
                <CardDescription className="text-foreground/70">
                  Consultez vos séjours à venir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-foreground/70">
                  Vous n'avez pas encore de réservation
                </p>
                <Button
                  onClick={() => router.push('/client/hotels')}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform group/btn"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Réserver maintenant
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-hsem-silver/20 hover:border-red-500/50 transition-all duration-300 animate-scale-in group" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="rounded-full bg-red-500/10 p-3 w-fit mb-2 group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-red-500 animate-glow-pulse" />
                </div>
                <CardTitle className="text-hsem-gold">Favoris</CardTitle>
                <CardDescription className="text-foreground/70">
                  Vos hôtels préférés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-foreground/70">
                  Aucun favori pour le moment
                </p>
                <Button
                  onClick={() => router.push('/client/favorites')}
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-accent hover:scale-105 transition-transform group/btn"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Découvrir
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-hsem-silver/20 hover:border-primary/50 transition-all duration-300 animate-scale-in group" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <div className="rounded-full bg-green-500/10 p-3 w-fit mb-2 group-hover:scale-110 transition-transform">
                  <CreditCard className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle className="text-hsem-gold">Moyens de paiement</CardTitle>
                <CardDescription className="text-foreground/70">
                  Gérez vos cartes enregistrées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-foreground/70">
                  Aucune carte enregistrée
                </p>
                <Button
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-accent hover:scale-105 transition-transform"
                >
                  Ajouter une carte
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <ChatbotWidget />
    </div>
  )
}
