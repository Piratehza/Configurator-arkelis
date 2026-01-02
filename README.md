# Cyrélis - Site Vitrine

Site vitrine de **Cyrélis**, spécialiste en cybersécurité managée pour TPE/PME.

## 🚀 Stack Technique

- **Framework**: Next.js 16 (App Router)
- **UI**: Tailwind CSS + Framer Motion
- **Email**: Resend (ou SMTP)
- **Hébergement**: Netlify

## 📋 Fonctionnalités

- ✅ Page d'accueil avec présentation des services
- ✅ Configurateur d'offres interactif
- ✅ Formulaire de contact avec envoi d'emails
- ✅ Pages légales (Mentions légales, CGV, Confidentialité)
- ✅ Page "À propos"
- ✅ SEO optimisé (robots.txt, sitemap.xml)

## 🛠️ Installation

```bash
# Cloner le repo
git clone https://github.com/votre-repo/cyrelis.git
cd cyrelis

# Installer les dépendances
npm install

# Copier la configuration
cp .env.example .env

# Lancer en développement
npm run dev
```

## ⚙️ Configuration

### Variables d'environnement

Copier `.env.example` vers `.env` et configurer :

```env
# URL du site
NEXT_PUBLIC_BASE_URL=https://cyrelis.fr

# Email (Resend)
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@cyrelis.fr
ADMIN_NOTIFICATION_EMAIL=contact@cyrelis.fr
```

### Configuration Resend

1. Créer un compte sur [resend.com](https://resend.com)
2. Vérifier votre domaine
3. Créer une API Key
4. Ajouter la clé dans `.env`

## 🚀 Déploiement sur Netlify

### Via Git

1. Connecter le repo GitHub à Netlify
2. Configurer les variables d'environnement dans Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`

### Via CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## 📁 Structure du projet

```
app/
├── (public)/           # Pages publiques
│   ├── page.tsx        # Accueil
│   ├── simulateur/     # Configurateur
│   ├── contact/        # Formulaire contact
│   ├── a-propos/       # Notre histoire
│   ├── mentions-legales/
│   ├── cgv/
│   └── confidentialite/
├── api/
│   └── contact/        # API envoi email
├── robots.ts           # SEO robots.txt
└── sitemap.ts          # SEO sitemap.xml

src/
├── components/         # Composants UI
│   ├── layout/         # Navbar, Footer
│   └── ui/             # Boutons, etc.
└── lib/
    └── email.ts        # Service d'email
```

## 📞 Contact

- **Email**: contact@cyrelis.fr
- **Site**: https://cyrelis.fr

---

© 2024-2026 Cyrélis - Matthieu Vallet EI
