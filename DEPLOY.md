# QuizzFoot — Guide de Déploiement

## 🚀 Développement local

### Prérequis
- Node.js ≥ 18
- npm ≥ 9

### Installation
```bash
cd "Quizz foot"
npm install
```

### Démarrage
```bash
# Mode démo (sans Supabase)
cp .env.local.example .env.local
# Garder NEXT_PUBLIC_DEMO_MODE=true

npm run dev
# → http://localhost:3000
```

### Commandes utiles
```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run lint         # Linting ESLint
npm run typecheck    # Vérification TypeScript
npm run test         # Tests unitaires (Vitest)
npm run format       # Formater le code (Prettier)
```

---

## 🗄️ Configuration Supabase (optionnel)

### 1. Créer un projet Supabase
- Aller sur [supabase.com](https://supabase.com)
- Créer un nouveau projet
- Copier l'URL et la clé anon

### 2. Configurer les variables d'environnement
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
NEXT_PUBLIC_DEMO_MODE=false
```

### 3. Exécuter la migration
- Dans le dashboard Supabase → SQL Editor
- Coller le contenu de `supabase/migrations/001_initial.sql`
- Exécuter

### 4. Seed des données
- Utiliser l'admin (`/admin`) pour exporter le JSON
- Importer dans Supabase via l'API ou le dashboard

---

## ☁️ Déploiement Vercel

### 1. Pousser le code sur GitHub
```bash
git init
git add .
git commit -m "🚀 QuizzFoot v1.0"
git remote add origin https://github.com/votre-user/quizzfoot.git
git push -u origin main
```

### 2. Connecter à Vercel
- [vercel.com/new](https://vercel.com/new)
- Importer le repo GitHub
- Ajouter les variables d'environnement (Supabase)
- Déployer

### 3. Domaine personnalisé (optionnel)
- Settings → Domains → ajouter votre domaine

---

## ✅ Checklist QA
- [ ] Page d'accueil : hero, catégories, CTA visibles
- [ ] Dark/Light mode fonctionne
- [ ] Quiz : sélection catégorie → 10 questions → résultats
- [ ] Timer fonctionne et timeout déclenche "mauvaise réponse"
- [ ] Daily Challenge : questions du jour cohérentes
- [ ] Classement : podium + top 10 affichés
- [ ] Profil : stats et badges affichés
- [ ] Admin : liste des questions, recherche, export JSON/CSV
- [ ] Responsive : tester 375px, 768px, 1440px
- [ ] Accessibilité : navigation clavier, focus visible
- [ ] Sons : toggle on/off fonctionne
- [ ] Duel : génération de lien + copie
- [ ] Auth : pages login/register affichées
- [ ] SEO : title/meta/OG sur chaque page
- [ ] Performance : build sans erreur, < 3s LCP
