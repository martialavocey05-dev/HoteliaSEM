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
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { MOCK_USERS } from '@/lib/mock-data/users'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login({ email, password })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = (role: 'admin' | 'hotelier' | 'client') => {
    const demoUser = MOCK_USERS.find((u) => u.role === role)
    if (demoUser) {
      setEmail(demoUser.email)
      setPassword(demoUser.password)
      setError('')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="animate-deep-sea-pulse absolute inset-0" />
      <div className="absolute inset-0 bg-[url('/images/hero-hotel.jpg')] bg-cover bg-center opacity-5" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="glass-card w-full max-w-md border-hsem-silver/20">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex justify-center">
              <HSEMLogo size="md" animated />
            </div>
            <div>
              <CardTitle className="font-serif text-3xl text-hsem-gold">Connexion</CardTitle>
              <CardDescription className="mt-2 text-hsem-alabaster/70">
                Accédez à votre espace HoteliaSEM
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-500/50 bg-red-950/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-hsem-alabaster">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-hsem-silver/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-hsem-silver/20 bg-hsem-navy/40 pl-10 text-hsem-alabaster placeholder:text-hsem-silver/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-hsem-alabaster">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-hsem-silver/50" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-hsem-silver/20 bg-hsem-navy/40 pl-10 pr-10 text-hsem-alabaster placeholder:text-hsem-silver/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-hsem-silver/50 hover:text-hsem-gold"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link
                  href="/forgot-password"
                  className="text-hsem-silver/70 transition-colors hover:text-hsem-gold"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-hsem-gold font-semibold text-hsem-navy hover:bg-hsem-gold/90"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="space-y-3 border-t border-hsem-silver/10 pt-4">
              <p className="text-center text-xs text-hsem-silver/60">Comptes de démonstration :</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('admin')}
                  className="border-hsem-gold/30 text-xs text-hsem-gold hover:bg-hsem-gold/10"
                >
                  Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('hotelier')}
                  className="border-hsem-silver/30 text-xs text-hsem-silver hover:bg-hsem-silver/10"
                >
                  Hôtelier
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('client')}
                  className="border-hsem-alabaster/30 text-xs text-hsem-alabaster hover:bg-hsem-alabaster/10"
                >
                  Client
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col space-y-2 border-t border-hsem-silver/10 pt-6">
            <p className="text-center text-sm text-hsem-alabaster/70">
              Pas encore de compte ?{' '}
              <Link href="/register" className="font-semibold text-hsem-gold transition-colors hover:text-hsem-gold/80">
                Créer un compte
              </Link>
            </p>
            <Link
              href="/"
              className="text-xs text-hsem-silver/60 transition-colors hover:text-hsem-silver"
            >
              ← Retour à l'accueil
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
