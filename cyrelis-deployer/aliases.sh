# Aliases Cyrélis Deployer
# Ajoutez cette ligne à votre ~/.zshrc ou ~/.bashrc :
# source /Users/ethan/projet-arkelis/cyrelis-deployer/aliases.sh

alias cyrelis-start='cd /Users/ethan/projet-arkelis/cyrelis-deployer && ./start.sh'
alias cyrelis-stop='cd /Users/ethan/projet-arkelis/cyrelis-deployer && ./stop.sh'
alias cyrelis-logs='tail -f /Users/ethan/projet-arkelis/cyrelis-deployer/server.log'
alias cyrelis-restart='cd /Users/ethan/projet-arkelis/cyrelis-deployer && ./stop.sh && sleep 2 && ./start.sh'
alias cyrelis-open='open http://127.0.0.1:8000'

echo "✅ Aliases Cyrélis chargés :"
echo "  - cyrelis-start    : Démarrer le serveur"
echo "  - cyrelis-stop     : Arrêter le serveur"
echo "  - cyrelis-restart  : Redémarrer le serveur"
echo "  - cyrelis-logs     : Voir les logs en temps réel"
echo "  - cyrelis-open     : Ouvrir dans le navigateur"
