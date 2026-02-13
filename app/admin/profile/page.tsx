'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/context/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HSEMLogo } from '@/components/hsem-logo'
import { ArrowLeft, Save, User, Mail, Phone, Shield } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      router.push('/login')
    } else if (user?.role !== 'admin') {
      router.push('/')
    } else {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      })
    }
  }, [isAuthenticated, isLoading, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSaving(false)
    alert('Profil administrateur mis à jour avec succès!')
  }

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <HSEMLogo size="md" animated />
          <p className="mt-4 text-hsem-gold">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="animate-deep-sea-pulse absolute inset-0" />

      <div className="relative">
        <header className="glass border-b border-hsem-silver/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-3 transition-transform hover:scale-105"
            >
              <HSEMLogo size="sm" />
              <span className="font-serif text-xl font-bold text-hsem-gold">HoteliaSEM</span>
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/admin/dashboard')}
              className="border-hsem-silver/20 text-hsem-alabaster hover:bg-hsem-gold/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au dashboard
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-hsem-gold/20 p-4">
                <Shield className="h-8 w-8 text-hsem-gold" />
              </div>
              <div>
                <h1 className="font-serif text-4xl font-bold text-hsem-gold">
                  Profil Administrateur
                </h1>
                <p className="mt-2 text-foreground/70">
                  Gérez vos informations d'administrateur système
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="glass-card border-hsem-gold/30 animate-scale-in">
              <CardHeader>
                <CardTitle className="text-hsem-gold">Informations personnelles</CardTitle>
                <CardDescription className="text-foreground/70">
                  Vos coordonnées administrateur
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground/90">
                      <User className="inline h-4 w-4 mr-2" />
                      Prénom
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="bg-background/50 border-hsem-silver/20 text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground/90">
                      <User className="inline h-4 w-4 mr-2" />
                      Nom
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="bg-background/50 border-hsem-silver/20 text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground/90">
                      <Mail className="inline h-4 w-4 mr-2" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-background/50 border-hsem-silver/20 text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground/90">
                      <Phone className="inline h-4 w-4 mr-2" />
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-background/50 border-hsem-silver/20 text-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="rounded-lg bg-hsem-gold/10 border border-hsem-gold/20 p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-hsem-gold mt-0.5" />
                    <div>
                      <p className="font-medium text-hsem-gold">Compte Administrateur</p>
                      <p className="text-sm text-foreground/70 mt-1">
                        Vous disposez d'un accès complet à toutes les fonctionnalités de la plateforme HoteliaSEM.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-hsem-gold text-hsem-navy hover:bg-hsem-gold/90 hover:scale-105 transition-transform"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin/dashboard')}
                    className="border-hsem-silver/20 text-foreground"
                  >
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </main>
      </div>
    </div>
  )
}
