'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/context/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HSEMLogo } from '@/components/hsem-logo'
import {
  Building2,
  DollarSign,
  LogOut,
  Shield,
  TrendingUp,
  Users,
  FileText,
  Settings,
} from 'lucide-react'
import { getUsersByRole } from '@/lib/mock-data/users'

export default function AdminDashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('[v0] AdminDashboard: Auth state', { isAuthenticated, isLoading, userRole: user?.role })
    if (isLoading) {
      return
    }
    if (!isAuthenticated) {
      console.log('[v0] AdminDashboard: Not authenticated, redirecting to login')
      router.push('/login')
    } else if (user?.role !== 'admin') {
      console.log('[v0] AdminDashboard: Wrong role, redirecting to home')
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

  if (!user || user.role !== 'admin') {
    return null
  }

  const stats = {
    clients: getUsersByRole('client').length,
    hoteliers: getUsersByRole('hotelier').length,
    admins: getUsersByRole('admin').length,
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
                <span className="ml-2 rounded-full bg-hsem-gold/20 px-2 py-1 text-xs text-hsem-gold">
                  Administrateur
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl font-bold text-hsem-gold">
                Panneau d'administration
              </h1>
              <p className="mt-2 text-hsem-alabaster/70">
                Bienvenue, {user.firstName} {user.lastName}
              </p>
            </div>
            <Shield className="h-12 w-12 text-hsem-gold/50" />
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <Card className="glass-card border-hsem-gold/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-hsem-alabaster/70">Utilisateurs</p>
                    <p className="text-3xl font-bold text-hsem-gold">
                      {stats.clients + stats.hoteliers + stats.admins}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-hsem-gold/70" />
                </div>
                <div className="mt-2 text-xs text-hsem-alabaster/50">
                  {stats.clients} clients, {stats.hoteliers} hôteliers
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-hsem-silver/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-hsem-alabaster/70">Hôtels</p>
                    <p className="text-3xl font-bold text-hsem-gold">0</p>
                  </div>
                  <Building2 className="h-8 w-8 text-hsem-silver/50" />
                </div>
                <div className="mt-2 text-xs text-hsem-alabaster/50">En attente: 0</div>
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
                <div className="mt-2 text-xs text-green-400">+0% ce mois</div>
              </CardContent>
            </Card>

            <Card className="glass-card border-hsem-silver/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-hsem-alabaster/70">Réservations</p>
                    <p className="text-3xl font-bold text-hsem-gold">0</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-hsem-silver/50" />
                </div>
                <div className="mt-2 text-xs text-hsem-alabaster/50">Total cette année</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass-card border-hsem-silver/20">
              <CardHeader>
                <CardTitle className="text-hsem-gold">Gestion des utilisateurs</CardTitle>
                <CardDescription className="text-hsem-alabaster/70">
                  Administrez les comptes et permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-hsem-silver/10 p-4">
                  <div>
                    <p className="font-medium text-hsem-alabaster">Clients</p>
                    <p className="text-sm text-hsem-alabaster/60">{stats.clients} comptes actifs</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-hsem-silver/20 text-hsem-alabaster">
                    Gérer
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-hsem-silver/10 p-4">
                  <div>
                    <p className="font-medium text-hsem-alabaster">Hôteliers</p>
                    <p className="text-sm text-hsem-alabaster/60">{stats.hoteliers} partenaires</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-hsem-silver/20 text-hsem-alabaster">
                    Gérer
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-hsem-gold/20 p-4">
                  <div>
                    <p className="font-medium text-hsem-gold">Administrateurs</p>
                    <p className="text-sm text-hsem-alabaster/60">{stats.admins} admins</p>
                  </div>
                  <Button size="sm" className="bg-hsem-gold/20 text-hsem-gold hover:bg-hsem-gold/30">
                    Gérer
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-hsem-silver/20">
              <CardHeader>
                <CardTitle className="text-hsem-gold">Approbations en attente</CardTitle>
                <CardDescription className="text-hsem-alabaster/70">
                  Hôtels et modifications à valider
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-hsem-silver/30" />
                  <p className="text-sm text-hsem-alabaster/70">
                    Aucune demande en attente
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-hsem-silver/20 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-hsem-gold">Journaux d'audit</CardTitle>
                <CardDescription className="text-hsem-alabaster/70">
                  Activité système et actions utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-hsem-silver/30" />
                  <p className="text-sm text-hsem-alabaster/70">
                    Aucune activité récente
                  </p>
                  <Button variant="outline" className="mt-4 border-hsem-silver/20 text-hsem-alabaster">
                    Voir tous les journaux
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card mt-6 border-hsem-silver/20">
            <CardHeader>
              <CardTitle className="text-hsem-gold">Configuration système</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="border-hsem-silver/20 text-hsem-alabaster">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres globaux
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
