#!/bin/bash

# Script d'arrêt pour Cyrélis Deployer

set -e

cd "$(dirname "$0")"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ -f "server.pid" ]; then
    PID=$(cat server.pid)
    if ps -p $PID > /dev/null 2>&1; then
        echo -e "${YELLOW}🛑 Arrêt du serveur (PID: $PID)...${NC}"
        kill $PID
        sleep 2
        if ps -p $PID > /dev/null 2>&1; then
            echo -e "${RED}⚠️  Arrêt forcé...${NC}"
            kill -9 $PID 2>/dev/null || true
        fi
        echo -e "${GREEN}✅ Serveur arrêté${NC}"
    else
        echo -e "${YELLOW}ℹ️  Aucun serveur en cours d'exécution${NC}"
    fi
    rm -f server.pid
else
    echo -e "${YELLOW}ℹ️  Aucun fichier PID trouvé${NC}"
    # Chercher manuellement les processus
    PIDS=$(ps aux | grep "python.*main.py" | grep -v grep | awk '{print $2}')
    if [ ! -z "$PIDS" ]; then
        echo -e "${YELLOW}🛑 Arrêt des processus trouvés...${NC}"
        echo "$PIDS" | xargs kill 2>/dev/null || true
        echo -e "${GREEN}✅ Processus arrêtés${NC}"
    fi
fi
