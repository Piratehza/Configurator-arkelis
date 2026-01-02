# Arkelis Web - Atheos Integrator Platform

## 🚀 Application Web FastAPI pour l'intégration Bitwarden

Version web moderne du script Arkelis Deployer, transformé en plateforme web sécurisée.

### 📋 Prérequis

- Python 3.8+
- pip

### 🔧 Installation

```bash
# Installer les dépendances
pip install -r requirements.txt
```

### ▶️ Lancement

```bash
# Démarrer le serveur
python main.py

# Ou avec uvicorn directement
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

L'application sera accessible sur : **http://localhost:8000**

### 🔐 Connexion

**Mot de passe par défaut** : `Atheos2024!`

Pour modifier le mot de passe, éditez la variable `ADMIN_PASSWORD` dans `main.py`.

### 📂 Structure

```
arkelis-web/
├── main.py                 # Backend FastAPI + logique métier
├── templates/
│   ├── login.html          # Page de connexion
│   └── index.html          # Dashboard principal
├── requirements.txt        # Dépendances Python
└── README.md              # Documentation
```

### 🎯 Fonctionnalités

1. **Authentification sécurisée** avec session cookie
2. **Interface moderne** Dark Mode (Slate/Blue)
3. **Import CSV intelligent** avec gestion des rôles et permissions
4. **Console en temps réel** affichant les logs d'exécution
5. **Golden Image** : Application automatique des politiques de sécurité

### 📝 Format CSV attendu

```csv
Email,Type,AccessAll,Groups
user1@atheos.fr,0,false,
admin@atheos.fr,2,true,
manager@atheos.fr,3,false,DIRECTION
```

**Colonnes** :
- `Email` : Email de l'utilisateur (requis)
- `Type` : 0=User, 2=Admin, 3=Manager (défaut: 0)
- `AccessAll` : true/false (défaut: false)
- `Groups` : Groupes séparés par virgule (optionnel)

### 🛡️ Sécurité

- Cookie de session sécurisé (httponly, samesite=strict)
- Protection des routes par vérification de session
- Mot de passe admin configurable
- Rate limiting automatique API (délai 1s entre requêtes)

### 🎨 Stack Technique

- **Backend** : FastAPI + Uvicorn
- **Frontend** : HTML5 + TailwindCSS (CDN)
- **Templates** : Jinja2
- **API** : Bitwarden Public API

### 📦 Déploiement Production

```bash
# Avec Gunicorn + Uvicorn workers
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Ou avec Docker
docker build -t arkelis-web .
docker run -p 8000:8000 arkelis-web
```

### 🤝 Support

Développé pour **Atheos** par votre équipe DevOps.

---

**© 2024 Atheos - Arkelis Platform**
