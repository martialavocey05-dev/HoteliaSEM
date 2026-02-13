"use client"

import { User, Hotel, Shield } from "lucide-react"

export function DemoCredentialsDisplay() {
  const credentials = [
    {
      role: "Admin",
      icon: Shield,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      accounts: [
        { email: "admin@hsem.cm", password: "Admin@2024!", name: "Marie Ndongo" },
        { email: "paul.ekotto@hsem.cm", password: "AdminSecure123!", name: "Paul Ekotto" },
      ],
    },
    {
      role: "Hotelier",
      icon: Hotel,
      color: "text-hsem-gold",
      bgColor: "bg-hsem-gold/10",
      borderColor: "border-hsem-gold/30",
      accounts: [
        { email: "hotel.meridien@hsem.cm", password: "Hotelier@2024", name: "Jean-Claude Mbarga" },
        { email: "hilton.yaounde@hsem.cm", password: "HiltonYde2024!", name: "Sophie Atangana" },
        { email: "kribi.beach@hsem.cm", password: "KribiResort@24", name: "Emmanuel Biya" },
      ],
    },
    {
      role: "Client",
      icon: User,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      accounts: [
        { email: "client@example.com", password: "Client123!", name: "Thomas Kamdem" },
        { email: "amelie.fotso@gmail.com", password: "Amelie@2024", name: "Amélie Fotso" },
        { email: "kevin.nana@yahoo.fr", password: "Kevin2024!", name: "Kevin Nana" },
      ],
    },
  ]

  return (
    <div className="glass-card rounded-2xl p-8 max-w-5xl mx-auto my-8 animate-fade-in-up">
      <div className="mb-6 text-center">
        <h3 className="font-serif text-2xl font-bold text-hsem-alabaster mb-2">
          Comptes de Test HSEM
        </h3>
        <p className="text-sm text-hsem-silver/70">
          Utilisez ces identifiants pour tester les différentes interfaces de la plateforme
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {credentials.map((category, i) => (
          <div
            key={category.role}
            className={`rounded-xl border ${category.borderColor} ${category.bgColor} p-5 animate-fade-in-up`}
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <category.icon className={`h-5 w-5 ${category.color}`} />
              <h4 className={`font-semibold ${category.color}`}>{category.role}</h4>
            </div>

            <div className="space-y-3">
              {category.accounts.map((account) => (
                <div
                  key={account.email}
                  className="rounded-lg bg-hsem-navy/40 p-3 text-xs border border-hsem-silver/5"
                >
                  <p className="font-medium text-hsem-alabaster mb-1">{account.name}</p>
                  <p className="text-hsem-silver/60 mb-0.5 break-all">{account.email}</p>
                  <p className="text-hsem-silver/60 font-mono">{account.password}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-xs text-hsem-silver/50">
        <p>Les utilisateurs sont automatiquement redirigés vers leur dashboard selon leur rôle</p>
        <p className="mt-1">
          <span className="text-red-400">Admin</span> → /admin/dashboard •{" "}
          <span className="text-hsem-gold">Hôtelier</span> → /partner/dashboard •{" "}
          <span className="text-blue-400">Client</span> → /client/account
        </p>
      </div>
    </div>
  )
}
