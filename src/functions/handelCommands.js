const {
    REST
 } = require("@discordjs/rest");
 const {
    Routes
 } = require('discord-api-types/v9');
 const fs = require('fs');
 
 const clientId = 'ID_BOT';
 const guildId = 'ID_SERVEUR';
 
 module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
       client.commandArray = [];
       for (folder of commandFolders) {
          const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
          for (const file of commandFiles) {
             const command = require(`../commands/${folder}/${file}`);
             client.commands.set(command.data.name, command);
             client.commandArray.push(command.data.toJSON());
          }
       }
 
       const rest = new REST({
          version: '9'
       }).setToken(process.env.token);
 
       (async () => {
          try {
             console.log('Commencer à rafraîchir les commandes de l\'application (/).');
 
             await rest.put(
                Routes.applicationCommands(clientId), {
                   body: client.commandArray
                },
             );
 
             console.log('Les commandes de l\'application (/) ont été rechargées avec succès.');
          } catch (error) {
             console.error(error);
          }
       })();
    };
 };
