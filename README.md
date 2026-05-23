# DALILI — Site web

> Site officiel de l'écosystème DALILI. Construit avec Astro 6, déployé sur Vercel.

---

## Stack

- **Framework** : Astro 6.3+
- **Langage** : TypeScript + Astro components
- **Styles** : CSS moderne (variables, container queries, fluid type), Lightning CSS
- **Contenu blog** : Markdown via Content Collections (Zod validation)
- **SEO** : sitemap auto, Open Graph, structured data
- **Hébergement** : Vercel (gratuit pour ce besoin)

Tout est **statique** (`output: static` par défaut). Pas de serveur, pas de base de données. Performance maximale, SEO parfait, hébergement gratuit.

---

## Installation locale

### Prérequis

- **Node.js 20.x ou +** ([nodejs.org](https://nodejs.org)) — vérifie avec `node -v`
- npm (livré avec Node) ou pnpm

### Lancer le projet

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de dev (port 4321 par défaut)
npm run dev

# Le site est sur http://localhost:4321
```

Le hot reload est actif : modifie un fichier → le navigateur se met à jour tout seul.

### Build production

```bash
npm run build      # génère le site dans ./dist
npm run preview    # le sert localement pour vérifier
```

---

## Structure du projet

```
dalili-web/
├── src/
│   ├── pages/                  → Routes (chaque fichier = une page)
│   │   ├── index.astro         → Page d'accueil
│   │   └── blog/
│   │       ├── index.astro     → Liste des articles
│   │       └── [...slug].astro → Article individuel (route dynamique)
│   │
│   ├── components/             → Composants réutilisables
│   │   ├── Nav.astro           → Navigation sticky
│   │   ├── Hero.astro          → Section hero immersive
│   │   ├── Story.astro         → Notre histoire + équipe
│   │   ├── Ecosystem.astro     → 3 piliers
│   │   ├── Testimonials.astro  → Témoignages éditoriaux
│   │   ├── Stats.astro         → Compteurs animés
│   │   └── Install.astro       → CTA final + footer
│   │
│   ├── layouts/
│   │   └── Base.astro          → Layout avec meta SEO + curseur custom
│   │
│   ├── styles/
│   │   └── global.css          → Design tokens DALILI
│   │
│   ├── content/
│   │   └── blog/               → Articles Markdown (1 fichier = 1 article)
│   │       ├── visa-etudiant-france-2026.md
│   │       ├── trouver-logement-etudiant-paris.md
│   │       └── caf-apl-etudiant-international.md
│   │
│   └── content.config.ts       → Schéma des articles (validation Zod)
│
├── public/                     → Assets statiques (favicon, robots.txt, og-image)
├── astro.config.mjs            → Config Astro
├── tsconfig.json
└── package.json
```

---

## Écrire un nouvel article de blog

1. Crée un fichier dans `src/content/blog/` (ex: `ouvrir-compte-bancaire.md`)
2. En haut du fichier, ajoute le **frontmatter** :

```markdown
---
title: "Le titre qui va sur Google et le header"
description: "1-2 phrases SEO qui apparaissent en meta + sur la carte du blog."
pubDate: 2026-03-12
category: "Démarches"
author: "Mouhcine Mellouk"
readTime: 6
featured: false
---

# Ton titre H1 ici (ou pas, le titre est déjà rendu par le template)

Ton contenu en Markdown. Les `##` deviennent des H2 stylés, les `>` des citations, etc.
```

Catégories valides : `Visa`, `Logement`, `Démarches`, `Vie étudiante`, `Communauté`
Mets `featured: true` sur un article pour qu'il apparaisse en grand en haut de la page blog. Un seul à la fois.

Sauvegarde → le site se met à jour automatiquement en dev.

---

## Personnaliser le design

Tous les **tokens visuels** sont dans `src/styles/global.css` (en haut du fichier, section `:root`). Si tu changes une couleur ici, ça se propage partout.

```css
:root {
  --dl-blue: #014df8;        /* couleur signature */
  --dl-cream: #F7F6F2;       /* fond clair */
  --dl-ink: #0A0E1F;         /* texte principal */
  /* ... */
}
```

Les composants utilisent des **styles scoped** Astro (le `<style>` à la fin d'un `.astro` ne s'applique qu'à ce composant). Tu peux donc modifier `Hero.astro` sans casser le reste.

---

## Déployer sur Vercel

### Première fois

1. **Push le code sur GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit: DALILI website"
   git branch -M main
   git remote add origin git@github.com:TON-COMPTE/dalili-website.git
   git push -u origin main
   ```

2. **Connecte à Vercel**

   - Va sur [vercel.com/new](https://vercel.com/new)
   - "Import Git Repository" → sélectionne `dalili-website`
   - Vercel **détecte Astro automatiquement** — laisse tous les réglages par défaut
   - Clique "Deploy"
   - 90 secondes plus tard, ton site est en ligne sur `dalili-website-xxx.vercel.app`

### Pour les déploiements suivants

Chaque `git push` sur `main` déclenche un déploiement automatique. C'est tout.

```bash
git add .
git commit -m "Article: ouvrir un compte bancaire"
git push
# → Vercel build et déploie en 60-90s
```

### Brancher ton domaine `dalili.fr`

1. Sur Vercel → ton projet → **Settings → Domains**
2. Ajoute `dalili.fr` et `www.dalili.fr`
3. Vercel te donne les enregistrements DNS à configurer chez ton registrar (OVH, Gandi, Namecheap, etc.)
4. Type **A** sur `@` pointant vers `76.76.21.21`
5. Type **CNAME** sur `www` pointant vers `cname.vercel-dns.com`
6. Vercel valide le DNS et émet le certificat HTTPS gratuit (Let's Encrypt) en quelques minutes

**N'oublie pas de mettre à jour `astro.config.mjs`** une fois le domaine actif :

```js
export default defineConfig({
  site: 'https://dalili.fr',  // déjà bon
  // ...
});
```

Et push à nouveau pour que les URLs canoniques + sitemap utilisent le bon domaine.

---

## SEO — ce qui est déjà fait

- ✅ Meta description + Open Graph + Twitter Card sur toutes les pages
- ✅ Structured data (JSON-LD Organization)
- ✅ Sitemap auto (`/sitemap-index.xml`)
- ✅ `robots.txt` qui pointe vers le sitemap
- ✅ Canonical URLs
- ✅ Heading hierarchy propre (un seul H1 par page)
- ✅ Lazy loading natif des images (à utiliser quand tu ajouteras des photos)
- ✅ Performance Lighthouse > 95 attendue (HTML statique)

### À faire après le 1ᵉʳ déploiement

1. **Google Search Console** : ajouter `dalili.fr`, soumettre le sitemap
2. **Plausible / Umami** (analytics privacy-friendly, optionnel) — pas Google Analytics
3. **Image OG** : remplacer `/public/og-image.jpg` (1200×630) — c'est l'image qui s'affiche sur LinkedIn / WhatsApp / Twitter quand on partage le site

---

## Performance — bonnes pratiques

- Images : préfère **WebP** ou **AVIF**, dans `src/assets/` (Astro optimise tout seul)
- N'importe pas de gros frameworks JS : Astro génère 0 JS par défaut, c'est sa force
- Si tu ajoutes une lib (ex: GSAP), pèse le coût avant — ce site doit rester < 100 KB de JS

---

## Ajouts qu'on n'a pas (volontairement) faits

Pour rester focus, je n'ai pas inclus :

- Newsletter (Brevo / Buttondown — à ajouter quand tu en auras besoin)
- Chat / Crisp / Intercom (pas pertinent à ce stade)
- Recherche dans le blog (Pagefind à intégrer plus tard, super léger)
- Pages légales (mentions, CGU, confidentialité) — **à rédiger avec un juriste**, je peux te générer des templates si tu veux

---

## Commandes utiles

```bash
npm run dev               # serveur de dev
npm run build             # build prod (dist/)
npm run preview           # prévisualiser le build
npm run astro -- --help   # toutes les commandes Astro
npm run astro check       # vérification de typage
```

---

## Équipe

- **Aymane Amri** — Full-Stack · IA · Communication
- **Mouad Mousmih** — Full-Stack · DevOps · IA
- **Mouhcine Mellouk** — Marketing · UX/UI · SEO · DA

> *On est des frères avant tout. Le projet ne passera jamais au-dessus de ça.*

---

## Licence

Tous droits réservés — DALILI © 2026
# dalili
