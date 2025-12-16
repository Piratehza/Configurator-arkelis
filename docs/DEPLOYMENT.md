# 🚀 Guide de Déploiement Cyrélis

## Architecture des Environnements

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           WORKFLOW GIT                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   [develop] ────PR────> [staging] ────PR────> [main]                       │
│       │                     │                    │                          │
│       ▼                     ▼                    ▼                          │
│   localhost            staging.cyrelis.fr    cyrelis.fr                    │
│   (ton ordi)           (tests)               (production)                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Branches Git

| Branche | Environnement | URL | Description |
|---------|---------------|-----|-------------|
| `develop` | Local | `localhost:3000` | Développement actif |
| `staging` | Staging | `staging.cyrelis.fr` | Tests avant prod |
| `main` | Production | `cyrelis.fr` | Site en ligne |

## Configuration Netlify

### 1. Créer le projet

1. Connecte ton repo GitHub à Netlify
2. Netlify détecte automatiquement Next.js

### 2. Configurer les branches

Dans **Site settings > Build & deploy > Branches**:
- **Production branch**: `main`
- **Branch deploys**: `staging`, `develop`

### 3. Variables d'environnement

Dans **Site settings > Environment variables**, ajoute :

#### Variables communes (tous les contextes)

```
DATABASE_URL          = postgresql://...
NEXTAUTH_SECRET       = [générer avec openssl rand -base64 32]
TOTP_ENCRYPTION_KEY   = [générer avec openssl rand -base64 32]
WEBAUTHN_RP_NAME      = Cyrélis
RESEND_API_KEY        = re_xxxx
EMAIL_FROM            = Cyrélis <noreply@cyrelis.fr>
```

#### Variables spécifiques par contexte

**Production (main)**:
```
APP_ENV               = production
NEXTAUTH_URL          = https://cyrelis.fr
WEBAUTHN_RP_ID        = cyrelis.fr
```

**Staging (staging/develop)**:
```
APP_ENV               = staging
NEXTAUTH_URL          = https://staging--cyrelis.netlify.app
WEBAUTHN_RP_ID        = staging--cyrelis.netlify.app
```

### 4. Domaines personnalisés

Dans **Domain settings**:
1. Ajoute `cyrelis.fr` pour la production
2. Ajoute `staging.cyrelis.fr` comme alias pour la branche staging

## Workflow Quotidien

### Développement

```bash
# 1. Créer une branche feature depuis develop
git checkout develop
git pull
git checkout -b feature/ma-fonctionnalite

# 2. Développer...
npm run dev

# 3. Commit et push
git add .
git commit -m "feat: ma fonctionnalité"
git push origin feature/ma-fonctionnalite

# 4. Créer une Pull Request vers develop
```

### Déployer en Staging

```bash
# 1. Merger la feature dans develop
git checkout develop
git merge feature/ma-fonctionnalite

# 2. Push vers staging
git checkout staging
git merge develop
git push origin staging

# Netlify déploie automatiquement sur staging.cyrelis.fr
```

### Déployer en Production

```bash
# Merger staging dans main
git checkout main
git merge staging
git push origin main

# Netlify déploie automatiquement sur cyrelis.fr
```

## Scripts npm utiles

```bash
# Développement local
npm run dev

# Build de test
npm run build

# Lancer le build de production localement
npm run build && npm run start
```

## Checklist avant mise en prod

- [ ] Build passe sans erreurs (`npm run build`)
- [ ] Tests manuels OK en staging
- [ ] Variables d'environnement configurées dans Netlify
- [ ] DNS configuré (si premier déploiement)
- [ ] SSL actif (automatique avec Netlify)
- [ ] Favicon et og-image uploadés dans `/public`
- [ ] Google Search Console configuré (optionnel)

## Rollback

En cas de problème en production :

1. Va dans **Deploys** sur Netlify
2. Trouve le dernier déploiement stable
3. Clique sur **Publish deploy**

Ou via Git :

```bash
git checkout main
git revert HEAD
git push origin main
```

## Monitoring

- **Netlify Analytics** : Trafic et performance
- **Netlify Functions logs** : Erreurs API
- **Supabase Dashboard** : État de la DB

