#!/bin/bash

# Script de démarrage robuste pour Cyrélis Deployer
# Ce script garantit que le serveur démarre toujours correctement

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Cyrélis Deployer - Démarrage...${NC}"

# Se placer dans le bon répertoire
cd "$(dirname "$0")"

# Vérifier si le serveur tourne déjà
if [ -f "server.pid" ]; then
    OLD_PID=$(cat server.pid)
    if ps -p $OLD_PID > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Serveur déjà en cours (PID: $OLD_PID)${NC}"
        echo -e "${YELLOW}Arrêt du serveur existant...${NC}"
        kill $OLD_PID 2>/dev/null || true
        sleep 2
    fi
fi

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 n'est pas installé${NC}"
    exit 1
fi

# Vérifier/créer l'environnement virtuel
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}📦 Création de l'environnement virtuel...${NC}"
    python3 -m venv venv
fi

# Activer l'environnement virtuel
echo -e "${YELLOW}🔧 Activation de l'environnement virtuel...${NC}"
source venv/bin/activate

# Installer/mettre à jour les dépendances si nécessaire
if [ ! -f "venv/.deps_installed" ] || [ requirements.txt -nt venv/.deps_installed ]; then
    echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
    venv/bin/pip install -q -r requirements.txt
    touch venv/.deps_installed
fi

# Nettoyer les anciens logs
if [ -f "server.log" ]; then
    # Garder seulement les 100 dernières lignes
    tail -100 server.log > server.log.tmp 2>/dev/null || true
    mv server.log.tmp server.log 2>/dev/null || true
fi

# Démarrer le serveur
echo -e "${GREEN}✅ Démarrage du serveur Cyrélis...${NC}"
nohup venv/bin/python main.py > server.log 2>&1 &
SERVER_PID=$!

# Sauvegarder le PID
echo $SERVER_PID > server.pid

# Attendre que le serveur démarre
echo -e "${YELLOW}⏳ Attente du démarrage...${NC}"
for i in {1..10}; do
    sleep 1
    if curl -s http://127.0.0.1:8000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Serveur démarré avec succès !${NC}"
        echo -e "${GREEN}🌐 Accès : http://127.0.0.1:8000${NC}"
        echo -e "${GREEN}📝 Logs : tail -f $(pwd)/server.log${NC}"
        echo -e "${GREEN}🔑 Mot de passe : Cyrelis2024!${NC}"
        exit 0
    fi
done

# Si on arrive ici, le serveur n'a pas démarré
echo -e "${RED}❌ Erreur : Le serveur n'a pas démarré${NC}"
echo -e "${YELLOW}Dernières lignes du log :${NC}"
tail -20 server.log
exit 1
