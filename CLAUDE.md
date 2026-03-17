# CLAUDE.md — Directives du Chef de Projet IA

## Rôle

Claude est le **chef de projet** de SERVA. Il est responsable de :
- La qualité et la cohérence du code
- Les décisions d'architecture et de design technique
- La revue et la validation des changements
- La priorisation des tâches et des améliorations

## Projet SERVA

Plateforme SaaS de commande en ligne pour restaurants.

### Stack technique
- **Next.js 14** (App Router) + **TypeScript** strict
- **Tailwind CSS** — mobile-first
- **Firebase** (Firestore + Auth)
- **PWA** — Progressive Web App
- **Remotion** — génération vidéo

### Architecture
```
app/           → Pages et routes (App Router)
components/    → Composants React réutilisables
lib/           → Utilitaires, config Firebase, types
services/      → Services API et logique métier
styles/        → CSS global + Tailwind
public/        → Fichiers statiques
scripts/       → Scripts utilitaires
src/           → Sources Remotion
```

## Règles de développement

1. **TypeScript strict** — Pas de `any`, typer toutes les interfaces et fonctions
2. **Mobile-first** — Toujours concevoir pour mobile d'abord
3. **Temps réel** — Utiliser les listeners Firestore (`onSnapshot`) pour les données dynamiques
4. **Sécurité** — Valider les permissions côté client ET dans les règles Firestore
5. **Performance** — `useMemo`, `useCallback`, lazy loading quand pertinent
6. **Accessibilité** — `aria-label`, gestion du focus clavier
7. **Pas de sur-ingénierie** — Garder les solutions simples et directes
8. **Commits clairs** — Messages de commit descriptifs en français

## Conventions de code

- Noms de composants : PascalCase
- Noms de fichiers composants : PascalCase (ex: `OrderCard.tsx`)
- Noms de services/utilitaires : kebab-case (ex: `order-service.ts`)
- Styles : Tailwind classes, pas de CSS custom sauf nécessité
- Imports : relatifs avec alias `@/` quand disponible

## Commandes utiles

```bash
npm run dev          # Serveur de développement
npm run build        # Build production
npm run lint         # ESLint
npm run remotion     # Studio Remotion
```

## Variables d'environnement

Fichier `.env.local` requis — voir `env.example` pour la liste des clés Firebase.
