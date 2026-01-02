# Cyrélis Deployer - Guide de Démarrage Rapide

## 🚀 Démarrage en 1 commande

```bash
./start.sh
```

## 🛑 Arrêt du serveur

```bash
./stop.sh
```

## 🔄 Redémarrage

```bash
./stop.sh && ./start.sh
```

## 📝 Voir les logs

```bash
tail -f server.log
```

## 🔧 Installation des aliases (optionnel)

Pour avoir des commandes encore plus courtes, ajoutez cette ligne à votre `~/.zshrc` :

```bash
echo "source /Users/ethan/projet-arkelis/cyrelis-deployer/aliases.sh" >> ~/.zshrc
source ~/.zshrc
```

Ensuite vous pourrez utiliser :
- `cyrelis-start` : Démarrer
- `cyrelis-stop` : Arrêter  
- `cyrelis-restart` : Redémarrer
- `cyrelis-logs` : Voir les logs
- `cyrelis-open` : Ouvrir dans le navigateur

## 🌐 Accès

**URL** : http://127.0.0.1:8000  
**Mot de passe** : `Cyrelis2024!`

## 🐛 Dépannage

Si le serveur ne démarre pas, vérifiez les logs :
```bash
cat server.log
```

Si le port 8000 est occupé :
```bash
lsof -ti:8000 | xargs kill -9
./start.sh
```

## 📦 Mise à jour des dépendances

```bash
./stop.sh
rm -rf venv
python3 -m venv venv
venv/bin/pip install -r requirements.txt
./start.sh
```
