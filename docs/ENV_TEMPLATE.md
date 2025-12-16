# Configuration des Environnements Cyrélis

## Structure des fichiers

```
.env.local      → Développement local (ton ordi)
.env.staging    → Environnement de test (staging.cyrelis.fr)
.env.production → Production (cyrelis.fr)
```

## Template de configuration

Copie ce contenu dans chaque fichier `.env.*` et adapte les valeurs :

```bash
# ═══════════════════════════════════════════════════════════════════════════════
# CYRÉLIS - CONFIGURATION [ENVIRONNEMENT]
# ═══════════════════════════════════════════════════════════════════════════════

# ┌─────────────────────────────────────────────────────────────────────────────┐
# │ ENVIRONNEMENT                                                               │
# └─────────────────────────────────────────────────────────────────────────────┘
APP_ENV=development  # development | staging | production

# ┌─────────────────────────────────────────────────────────────────────────────┐
# │ BASE DE DONNÉES                                                             │
# └─────────────────────────────────────────────────────────────────────────────┘
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# ┌─────────────────────────────────────────────────────────────────────────────┐
# │ AUTHENTIFICATION (NextAuth.js)                                              │
# └─────────────────────────────────────────────────────────────────────────────┘
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-ici"

# ┌─────────────────────────────────────────────────────────────────────────────┐
# │ SÉCURITÉ 2FA (TOTP)                                                         │
# └─────────────────────────────────────────────────────────────────────────────┘
TOTP_ENCRYPTION_KEY="votre-cle-chiffrement-ici"

# ┌─────────────────────────────────────────────────────────────────────────────┐
# │ PASSKEYS (WebAuthn)                                                         │
# └─────────────────────────────────────────────────────────────────────────────┘
WEBAUTHN_RP_NAME="Cyrélis"
WEBAUTHN_RP_ID="localhost"

# ┌─────────────────────────────────────────────────────────────────────────────┐
# │ EMAILS                                                                      │
# └─────────────────────────────────────────────────────────────────────────────┘
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="Cyrélis <noreply@cyrelis.fr>"

# ┌─────────────────────────────────────────────────────────────────────────────┐
# │ DÉVELOPPEMENT UNIQUEMENT                                                    │
# └─────────────────────────────────────────────────────────────────────────────┘
ALLOWED_IPS="192.168.1.1,172.20.10.4"
```

## Valeurs par environnement

| Variable | Local | Staging | Production |
|----------|-------|---------|------------|
| `APP_ENV` | `development` | `staging` | `production` |
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://staging.cyrelis.fr` | `https://cyrelis.fr` |
| `WEBAUTHN_RP_ID` | `localhost` | `staging.cyrelis.fr` | `cyrelis.fr` |
| `DATABASE_URL` | DB locale | DB staging | DB production |

## Génération des clés secrètes

```bash
# Générer NEXTAUTH_SECRET
openssl rand -base64 32

# Générer TOTP_ENCRYPTION_KEY
openssl rand -base64 32
```

⚠️ **Important** : Utilise des clés DIFFÉRENTES pour chaque environnement !

