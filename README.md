# Authron
Authron est un bot Discord qui met en place une authentification à émojis.

Authron se base sur le code de [Razlar](https://www.youtube.com/@razlar2080) <= crédits, l'idée a été reprise par moi, j'y ai ajouté des fonctionnalités et j'ai amélioré le code.

# Ce que j'ai ajouté
- Changement de l'émoji toutes les minutes <= toute la logique pour savoir si l'émoji est le bon, changements etc.
- Système d'expulsion au bout de deux tentatives échouées.
- Plus d'embeds, de détails, d'émojis, de couleurs + timestamps, infos...
- Vérification si aucune authentification existe.
- Vérification si l'utilisateur est déjà vérifié.
- Vérification pour savoir si le rôle sélectionné par l'utilisateur n'est pas au-dessus de Authron / pas au-dessus de l'utilisateur.
- Vérification pour éviter de pouvoir définir le rôle @everyone ainsi que les rôles des BOTS.
- Traduction en français.

# À faire
- Optimiser et nettoyer le code pour le rendre plus clair. | ✨ Embelli, à optimiser.
- ~~Ajouter une vérification pour savoir si le rôle sélectionné par l'utilisateur dans `/auth-setup` n'est pas au-dessus de Authron / pas au-dessus de l'utilisateur.~~ | ✅ Fait.
- ~~Ajouter une vérification pour éviter de pouvoir définir le rôle @everyone ainsi que les rôles des BOTS dans `/auth-setup`, actuellement, si c'est le cas, Authron arrête de fonctionner.~~ | ✅ Fait.
- Ajouter une vérification pour savoir si l'utilisateur qui a échoué deux fois est supérieur à Authron, si c'est le cas, gérer la situation car Authron ne pourra pas l'expulser.
- Changer l'ordre des boutons pour plus de difficultés toutes les minutes.
- Ajouter une option 'sanction' dans la commande `/auth-setup` qui permettrait de choisir une sanction à appliquer aux utilisateurs qui échouent deux fois (ban, kick, ou aucune)
- Ajouter une option 'logs' dans la commande `/auth-setup` qui permettrait d'envoyer les logs dans un salon spécifique.


# Installation
- Nécessite discord.js v14, mongoose, dotenv et shuffle de lodash : `npm i discord.js` & `npm i mongoose` & `npm i dotenv` & `npm i lodash`
- Créer un BOT depuis le [portail des développeurs de Discord](https://discord.com/developers/applications).
- Cocher les intents nécessaires : Intention des membres du serveur | Intention du contenu du message
- Ajouter le bot sur votre serveur avec les scopes `bot` & `applications.commands`.
- Créer une base de données [MongoDB](https://www.mongodb.com/fr-fr).
- Une fois votre cluster connecté à un driver Mongo (driver : Node.js, version : 5.5 ou plus), installez le driver avec : `npm install mongodb`
- Ajoutez votre chaîne de connexion dans le fichier `.env` après `MONGODBURL`.
- Ajoutez le token de votre bot dans le fichier `.env` après `token`.
- Ajoutez l'identifiant de votre bot et de votre serveur dans le fichier `handelCommands.js`.
- Ouvrez la console, et exécuter `node .` à l'intérieur du répertoire.

# Informations
Authron est fait pour être exécuté en local, et n'est pas fait pour être rendu public, par exemple, à chaque redémarrage, vous devez refaire la configuration pour l'authentification (en attente d'un fix).

Le code n'est pas optimisé et n'est pas clair, c'est un petit projet que j'ai fait rapidement, alors il peut contenir des inexactitudes, des bugs et des choses illogiques comme des variables jamais utilisées etc.

Une fois l'authentification à émojis mise en place (`/auth-setup`), Authron enverra un message dans le salon choisit par l'utilisateur avec la vérification.

L'émoji à sélectionner change toutes les minutes.

Si l'utilisateur qui échoue deux fois est supérieur à Authron, il enverra une erreur dans le terminal car il ne pourra pas l'expulser (en attente d'un fix de ma part).

# Images

![image](https://github.com/arceusxx/authron/assets/96443442/64348348-856c-45c8-95e3-d0ea9e99862a)
![image](https://github.com/arceusxx/authron/assets/96443442/2590b452-9a0f-4e80-ac33-6877f9f6eeb2)
![image](https://github.com/arceusxx/authron/assets/96443442/935f4507-5186-4a36-ad5d-9ccb61c52ac1)

