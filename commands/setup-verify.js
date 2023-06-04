const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-verif')
        .setDescription('🛡️ Setup verification system')
        .addChannelOption(option => option.setName('channel').setDescription('Channel for verification message').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Role to be assigned after verification').setRequired(true)),
    async execute(interaction) {
        const allowedUserId = '117381264826302464';

        if (interaction.user.id !== allowedUserId) {
            return await interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole('role');

        if (!channel.isText()) {
            return await interaction.reply({ content: 'Please select a text channel.', ephemeral: true });
        }

        const embed = new MessageEmbed()
            .setTitle('Verification System')
            .setDescription('This server requires you to verify yourself in order to access the other channels, please run the `/verify` command.')
            .setColor('#68d19e')
            .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
            .setTimestamp();

        const verificationMessage = await channel.send({ embeds: [embed] });

        db.set('verificationChannel', channel.id);
        db.set('verificationRole', role.id);
        db.set('verificationMessage', verificationMessage.id);

        await interaction.reply('Verification system set up successfully.');
    },
};
