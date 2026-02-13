'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/context/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HSEMLogo } from '@/components/hsem-logo'
import { Building2, Calendar, DollarSign, LogOut, PlusCircle, Settings, TrendingUp } from 'lucide-react'

export default function PartnerDashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('[v0] PartnerDashboard: Auth state', { isAuthenticated, isLoading, userRole: user?.role })
    if (isLoading) {
      return
    }
    if (!isAuthenticated) {
      console.log('[v0] PartnerDashboard: Not authenticated, redirecting to login')
      router.push('/login')
    } else if (user?.role !== 'hotelier') {
      console.log('[v0] PartnerDashboard: Wrong role, redirecting to home')
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

  if (!user || user.role !== 'hotelier') {
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
              <div>
                <span className="font-serif text-xl font-bold text-hsem-gold">HoteliaSEM</span>
                <span className="ml-2 rounded-full bg-hsem-silver/20 px-2 py-1 text-xs text-hsem-silver">
                  Partenaire
                </span>
              </div>
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
              Tableau de bord Partenaire
            </h1>
            <p className="mt-2 text-hsem-alabaster/70">
              Bienvenue, {user.firstName} {user.lastName}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <Card className="glass-card border-hsem-silver/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-hsem-alabaster/70">Hôtels</p>
                    <p className="text-3xl font-bold text-hsem-gold">0</p>
                  </div>
                  <Building2 className="h-8 w-8 text-hsem-silver/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-hsem-silver/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-hsem-alabaster/70">Réservations</p>
                    <p className="text-3xl font-bold text-hsem-gold">0</p>
                  </div>
                  <Calendar className="h-8 w-8 text-hsem-silver/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-hsem-silver/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-hsem-alabaster/70">Revenus (XAF)</p>
                    <p className="text-3xl font-bold text-hsem-gold">0</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-hsem-silver/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-hsem-silver/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-hsem-alabaster/70">Taux occup.</p>
                    <p className="text-3xl font-bold text-hsem-gold">0%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-hsem-silver/50" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass-card border-hsem-silver/20">
              <CardHeader>
                <CardTitle className="text-hsem-gold">Mes Hôtels</CardTitle>
                <CardDescription className="text-hsem-alabaster/70">
                  Gérez vos établissements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 text-center py-8">
                  <Building2 className="mx-auto mb-4 h-12 w-12 text-hsem-silver/30" />
                  <p className="mb-4 text-sm text-hsem-alabaster/70">
                    Vous n'avez pas encore ajouté d'hôtel
                  </p>
                  <Button className="bg-hsem-gold text-hsem-navy hover:bg-hsem-gold/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un hôtel
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-hsem-silver/20">
              <CardHeader>
                <CardTitle className="text-hsem-gold">Réservations récentes</CardTitle>
                <CardDescription className="text-hsem-alabaster/70">
                  Dernières demandes de réservation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="mx-auto mb-4 h-12 w-12 text-hsem-silver/30" />
                  <p className="text-sm text-hsem-alabaster/70">
                    Aucune réservation pour le moment
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card mt-6 border-hsem-silver/20">
            <CardHeader>
              <CardTitle className="text-hsem-gold">Profil Partenaire</CardTitle>
              <CardDescription className="text-hsem-alabaster/70">
                Vos informations de compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-hsem-alabaster/50">Email</p>
                  <p className="text-hsem-alabaster">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-hsem-alabaster/50">Téléphone</p>
                  <p className="text-hsem-alabaster">{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-hsem-alabaster/50">Nom complet</p>
                  <p className="text-hsem-alabaster">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-hsem-alabaster/50">Type de compte</p>
                  <p className="text-hsem-alabaster">Hôtelier</p>
                </div>
              </div>
              <Button variant="outline" className="mt-4 border-hsem-silver/20 text-hsem-alabaster">
                <Settings className="mr-2 h-4 w-4" />
                Modifier le profil
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
