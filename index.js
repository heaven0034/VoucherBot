const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./token.json');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const db = require('quick.db');

const client = new Client({ intents: 3276799 });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data && command.data.name) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(`Command "${file}" is missing the "data" or "name" property and will not be registered.`);
    }
}

const rest = new REST({ version: '9' }).setToken(token);

async function deployCommands() {
    const commands = [];
    for (const command of client.commands.values()) {
        commands.push(command.data.toJSON());
    }

    try {
        console.log('Deployment of commands in progress...');

        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );

        console.log('The commands have been successfully deployed!');
    } catch (error) {
        console.error('An error occurred during the deployment of :', error);
    }
}

client.once('ready', () => {
    console.log(`The bot ${client.user.tag} is online ✅`);
    client.user.setStatus('idle');

    deployCommands();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'An error occurred during the execution of this command.', ephemeral: true });
    }
});

const vouchChannelId = '1114926135000711229'; // Put ID of the Vouch channel
const deleteDelay = 5000;

client.on('messageCreate', async (message) => {
  if (message.channel.id === vouchChannelId) {
    if (message.author.bot) return;

    const reply = await message.reply("Please use the </vouch:1114910378829299782> command to give your opinion and do not send a message directly.");

    setTimeout(() => {
      message.delete().catch(console.error);
      reply.delete().catch(console.error);
    }, deleteDelay);
  }
});

client.login(token);