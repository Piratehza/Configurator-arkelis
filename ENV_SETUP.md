# 🔐 Configuration des Variables d'Environnement Cyrélis

## Étape 1 : Créer le fichier `.env`

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
# ============================================
# BASE DE DONNÉES SUPABASE
# ============================================
# Allez dans Supabase Dashboard > Settings > Database > Connection String
# Copiez le mot de passe que vous avez défini lors de la création du projet

DATABASE_URL="postgresql://postgres.ribpnokctocaeppwuqrj:[VOTRE_MOT_DE_PASSE]@aws-0-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.ribpnokctocaeppwuqrj:[VOTRE_MOT_DE_PASSE]@aws-0-eu-west-3.pooler.supabase.com:5432/postgres"

# ============================================
# AUTHENTIFICATION NEXTAUTH
# ============================================
NEXTAUTH_SECRET="GENEREZ_AVEC_openssl_rand_-base64_32"
NEXTAUTH_URL="http://localhost:3000"

# ============================================
# EMAILS ADMIN
# ============================================
ADMIN_EMAILS="matthieu@cyrelis.fr,ethan@cyrelis.fr"

# ============================================
# SUPABASE PUBLIC (déjà configuré)
# ============================================
NEXT_PUBLIC_SUPABASE_URL="https://ribpnokctocaeppwuqrj.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYnBub2tjdG9jYWVwcHd1cXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MDc5MTUsImV4cCI6MjA4MTM4MzkxNX0.LWo4Mt9H1gKZpATF2jvpnh3OtTtC6940jhTA5zzxQww"
```

## Étape 2 : Récupérer le mot de passe Supabase

1. Allez sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet `ribpnokctocaeppwuqrj`
3. Allez dans **Settings** > **Database** > **Connection string**
4. Cliquez sur **URI** et copiez le mot de passe (après `postgres:` et avant `@`)

## Étape 3 : Générer le secret NextAuth

Dans votre terminal :
```bash
openssl rand -base64 32
```

Copiez le résultat dans `NEXTAUTH_SECRET`.

## Étape 4 : Synchroniser Prisma

Une fois le `.env` configuré :

```bash
# Générer le client Prisma
npx prisma generate

# Vérifier que la connexion fonctionne
npx prisma db pull

# Redémarrer le serveur
rm -rf .next && npm run dev
```

## 🎯 Vérification

Si tout est correct, vous pourrez accéder à :
- **Site** : http://localhost:3000
- **Login** : http://localhost:3000/login
- **Admin** : http://localhost:3000/admin (après connexion avec email admin)
