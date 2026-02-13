# 🔐 HoteliaSEM - Comptes de démonstration ***

Ce document liste tous les comptes utilisateur de test disponibles pour la plateforme HoteliaSEM. Utilisez ces identifiants pour tester les différents niveaux d'accès et fonctionnalités.

---

## 👑 Administrateurs

### Admin 1 - Marie Ndongo
- **Email:** `admin@hsem.cm`
- **Mot de passe:** `Admin@2024!`
- **Téléphone:** +237677123456
- **Dashboard:** `/admin/dashboard`
- **Permissions:** Accès complet, gestion utilisateurs, approbation hôtels, journaux d'audit

### Admin 2 - Paul Ekotto
- **Email:** `paul.ekotto@hsem.cm`
- **Mot de passe:** `AdminSecure123!`
- **Téléphone:** +237699876543
- **Dashboard:** `/admin/dashboard`

---

## 🏨 Hôteliers (Partenaires)

### Hôtelier 1 - Jean-Claude Mbarga (Hôtel Le Méridien)
- **Email:** `hotel.meridien@hsem.cm`
- **Mot de passe:** `Hotelier@2024`
- **Téléphone:** +237677234567
- **Dashboard:** `/partner/dashboard`
- **Permissions:** Gestion de ses propres hôtels, réservations, statistiques

### Hôtelier 2 - Sophie Atangana (Hilton Yaoundé)
- **Email:** `hilton.yaounde@hsem.cm`
- **Mot de passe:** `HiltonYde2024!`
- **Téléphone:** +237699345678
- **Dashboard:** `/partner/dashboard`

### Hôtelier 3 - Emmanuel Biya (Kribi Beach Resort)
- **Email:** `kribi.beach@hsem.cm`
- **Mot de passe:** `KribiResort@24`
- **Téléphone:** +237677456789
- **Dashboard:** `/partner/dashboard`

### Hôtelier 4 - Françoise Ngo Balla (Plaza Douala)
- **Email:** `plaza.douala@hsem.cm`
- **Mot de passe:** `PlazaDla2024!`
- **Téléphone:** +237699567890
- **Dashboard:** `/partner/dashboard`

---

## 👤 Clients

### Client 1 - Thomas Kamdem
- **Email:** `client@example.com`
- **Mot de passe:** `Client123!`
- **Téléphone:** +237677345678
- **Dashboard:** `/client/account`
- **Permissions:** Réservations, favoris, gestion profil

### Client 2 - Amélie Fotso
- **Email:** `amelie.fotso@gmail.com`
- **Mot de passe:** `Amelie@2024`
- **Téléphone:** +237699678901
- **Dashboard:** `/client/account`

### Client 3 - Kevin Nana
- **Email:** `kevin.nana@yahoo.fr`
- **Mot de passe:** `Kevin2024!`
- **Téléphone:** +237677789012
- **Dashboard:** `/client/account`

### Client 4 - Linda Tchoumi
- **Email:** `linda.tchoumi@outlook.com`
- **Mot de passe:** `Linda@Secure24`
- **Téléphone:** +237699890123
- **Dashboard:** `/client/account`

### Client 5 - Boris Essomba
- **Email:** `boris.essomba@gmail.com`
- **Mot de passe:** `Boris123!Safe`
- **Téléphone:** +237677901234
- **Dashboard:** `/client/account`

### Client 6 - Céline Moukouri
- **Email:** `celine.moukouri@hotmail.fr`
- **Mot de passe:** `Celine@2024Pass`
- **Téléphone:** +237699012345
- **Dashboard:** `/client/account`

---

## 🎯 Système de redirection automatique

Après connexion réussie, l'utilisateur est **automatiquement redirigé** vers son dashboard selon son rôle :

| Rôle | Dashboard | Fonctionnalités principales |
|------|-----------|----------------------------|
| **Admin** | `/admin/dashboard` | Gestion globale, utilisateurs, approbations, statistiques système |
| **Hôtelier** | `/partner/dashboard` | Gestion hôtels, réservations, statistiques établissement |
| **Client** | `/client/account` | Réservations, favoris, profil, paiements |

---

## 🔐 Sécurité & Sessions

- Les sessions sont stockées dans `localStorage` avec JWT simulés
- Les tokens incluent l'ID utilisateur et un timestamp
- Déconnexion : supprime le token et redirige vers la page d'accueil
- Accès protégé : vérification du rôle avant affichage du dashboard

---

## 📝 Fonctionnalités d'authentification

### Page de connexion (`/login`)
- Validation email + mot de passe
- Affichage d'erreurs claires
- Boutons de remplissage rapide pour démo (Admin, Hôtelier, Client)
- Toggle affichage/masquage mot de passe
- Lien vers inscription et récupération mot de passe

### Page d'inscription (`/register`)
- Formulaire complet : nom, prénom, email, téléphone
- Sélection du type de compte (Client ou Hôtelier)
- Validation mot de passe (min 8 caractères)
- Confirmation mot de passe
- Vérification email unique

### Navbar dynamique
- Affiche "Connexion" si non connecté → redirige vers `/login`
- Affiche le prénom de l'utilisateur si connecté → redirige vers son dashboard
- Même comportement sur mobile et desktop

---

## 🧪 Test rapide

1. Cliquez sur "Connexion" dans la navbar
2. Utilisez les boutons "Admin", "Hôtelier" ou "Client" pour remplir automatiquement
3. Cliquez sur "Se connecter"
4. Vous êtes redirigé vers le dashboard correspondant à votre rôle
5. Explorez les fonctionnalités disponibles
6. Cliquez sur "Déconnexion" pour revenir à l'accueil

---

## 🚀 Prochaines étapes d'intégration

Pour connecter au backend Flask réel :

1. Remplacer les appels mock dans `auth-context.tsx` par des appels API réels
2. Utiliser `fetch()` ou `axios` pour communiquer avec les endpoints Flask
3. Endpoints requis :
   - `POST /api/auth/register` - Inscription
   - `POST /api/auth/login` - Connexion
   - `POST /api/auth/logout` - Déconnexion
   - `POST /api/auth/refresh` - Rafraîchir token
   - `GET /api/auth/me` - Vérifier session

4. Stocker les vrais JWT tokens
5. Ajouter intercepteurs pour attacher tokens aux requêtes
6. Implémenter refresh token automatique

---

**Développé avec ❤️ pour HoteliaSEM**
