"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HSEMLogo } from "./hsem-logo"
import { Menu, X, Globe, User, ChevronDown, Moon, Sun } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"
import { useTheme } from "@/lib/context/theme-context"
import { ROLE_DASHBOARDS } from "@/lib/mock-data/users"

const navLinks = [
  { label: "Accueil", href: "#hero" },
  { label: "Destinations", href: "#destinations" },
  { label: "Services", href: "#services" },
  { label: "Architecture", href: "#architecture" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  const handleAuthClick = () => {
    if (isAuthenticated && user) {
      router.push(ROLE_DASHBOARDS[user.role])
    } else {
      router.push("/login")
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass" role="navigation" aria-label="Navigation principale">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <a href="#hero" className="flex items-center gap-3" aria-label="HoteliaSEM - Retour a l'accueil">
          <HSEMLogo size="sm" animated={false} />
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-wide text-hsem-gold">
              HoteliaSEM
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-hsem-silver">
              Luxe & Excellence
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 rounded-full border border-border bg-background p-2 text-foreground transition-colors hover:border-primary hover:text-primary"
            aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
            aria-label="Changer la langue"
          >
            <Globe className="h-3.5 w-3.5" />
            FR
            <ChevronDown className="h-3 w-3" />
          </button>
          <button
            onClick={handleAuthClick}
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
          >
            <User className="h-4 w-4" />
            {isAuthenticated ? `${user?.firstName || 'Mon compte'}` : 'Connexion'}
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="glass border-t border-border md:hidden">
          <div className="flex flex-col px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4" />
                    Mode Clair
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    Mode Sombre
                  </>
                )}
              </button>
              <button
                onClick={handleAuthClick}
                className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform"
              >
                <User className="h-4 w-4" />
                {isAuthenticated ? `${user?.firstName || 'Mon compte'}` : 'Connexion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
