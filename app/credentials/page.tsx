import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DemoCredentialsDisplay } from "@/components/demo-credentials-display"

export default function CredentialsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 animate-deep-sea-pulse" />
      <Navbar />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32">
        <div className="mb-12 text-center animate-fade-in-up">
          <h1 className="mb-4 font-serif text-4xl font-bold text-hsem-alabaster md:text-5xl">
            Comptes de Démonstration
          </h1>
          <p className="text-lg text-hsem-silver/70">
            Testez toutes les fonctionnalités de HoteliaSEM avec ces identifiants
          </p>
        </div>

        <DemoCredentialsDisplay />

        <div className="mt-12 glass-card rounded-2xl p-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="mb-4 font-serif text-2xl font-bold text-hsem-alabaster">
            Comment tester ?
          </h2>
          <ol className="space-y-3 text-hsem-silver/80">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-hsem-gold text-sm font-bold text-hsem-navy">
                1
              </span>
              <span>
                Cliquez sur <strong className="text-hsem-gold">Connexion</strong> dans la barre de navigation
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-hsem-gold text-sm font-bold text-hsem-navy">
                2
              </span>
              <span>
                Utilisez les boutons <strong className="text-hsem-gold">Admin</strong>, <strong className="text-hsem-gold">Hôtelier</strong> ou <strong className="text-hsem-gold">Client</strong> pour remplir automatiquement les identifiants
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-hsem-gold text-sm font-bold text-hsem-navy">
                3
              </span>
              <span>
                Cliquez sur <strong className="text-hsem-gold">Se connecter</strong> pour être redirigé vers le dashboard correspondant
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-hsem-gold text-sm font-bold text-hsem-navy">
                4
              </span>
              <span>
                Explorez les fonctionnalités et utilisez le bouton <strong className="text-hsem-gold">Déconnexion</strong> pour tester un autre rôle
              </span>
            </li>
          </ol>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <div className="glass-card rounded-xl p-6 border-l-4 border-red-500">
            <h3 className="mb-2 font-bold text-red-500">Dashboard Admin</h3>
            <p className="text-sm text-hsem-silver/70 mb-2">Route : <code className="text-hsem-gold">/admin/dashboard</code></p>
            <p className="text-xs text-hsem-silver/60">
              Gestion complète : utilisateurs, hôtels, approbations, statistiques système
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 border-l-4 border-hsem-gold">
            <h3 className="mb-2 font-bold text-hsem-gold">Dashboard Hôtelier</h3>
            <p className="text-sm text-hsem-silver/70 mb-2">Route : <code className="text-hsem-gold">/partner/dashboard</code></p>
            <p className="text-xs text-hsem-silver/60">
              Gestion de l'établissement, réservations, statistiques, calendrier
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 border-l-4 border-blue-500">
            <h3 className="mb-2 font-bold text-blue-500">Espace Client</h3>
            <p className="text-sm text-hsem-silver/70 mb-2">Route : <code className="text-hsem-gold">/client/account</code></p>
            <p className="text-xs text-hsem-silver/60">
              Mes réservations, favoris, profil, historique de paiements
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
