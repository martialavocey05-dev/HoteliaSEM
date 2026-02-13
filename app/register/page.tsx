'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/context/auth-context'
import { HSEMLogo } from '@/components/hsem-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, UserCog } from 'lucide-react'
import { UserRole } from '@/lib/types/auth'

export default function RegisterPage() {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'client' as UserRole,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    setIsLoading(true)

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: formData.role,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'inscription')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="animate-deep-sea-pulse absolute inset-0" />
      <div className="absolute inset-0 bg-[url('/images/hero-hotel.jpg')] bg-cover bg-center opacity-5" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="glass-card w-full max-w-md border-border/50">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex justify-center">
              <HSEMLogo size="md" animated />
            </div>
            <div>
              <CardTitle className="font-serif text-3xl text-primary">Inscription</CardTitle>
              <CardDescription className="mt-2 text-muted-foreground">
                Créez votre compte HoteliaSEM
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="border-red-500/50 bg-red-950/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground">
                    Prénom
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-hsem-silver/50" />
                    <Input
                      id="firstName"
                      placeholder="Jean"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="border-border bg-muted pl-10 text-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground">
                    Nom
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="border-border bg-muted text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-hsem-silver/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-border bg-muted pl-10 text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">
                  Téléphone
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-hsem-silver/50" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+237 6XX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-border bg-muted pl-10 text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-foreground">
                  Type de compte
                </Label>
                <div className="relative">
                  <UserCog className="absolute left-3 top-3 z-10 h-4 w-4 text-hsem-silver/50" />
                  <Select
                    value={formData.role}
                    onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className="border-border bg-muted pl-10 text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-card">
                      <SelectItem value="client" className="text-foreground">
                        Client
                      </SelectItem>
                      <SelectItem value="hotelier" className="text-foreground">
                        Hôtelier / Partenaire
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-hsem-silver/50" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="border-border bg-muted pl-10 pr-10 text-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-hsem-silver/50" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="border-border bg-muted pl-10 text-foreground"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform"
                disabled={isLoading}
              >
                {isLoading ? 'Inscription...' : 'Créer mon compte'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex-col space-y-2 border-t border-border/50 pt-6">
            <p className="text-center text-sm text-muted-foreground">
              Déjà un compte ?{' '}
              <Link href="/login" className="font-semibold text-primary transition-colors hover:text-primary/80">
                Se connecter
              </Link>
            </p>
            <Link
              href="/"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Retour à l'accueil
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
