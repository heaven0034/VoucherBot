const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('✅ Verify yourself'),
    async execute(interaction) {
        const verificationChannelId = db.get('verificationChannel');
        const verificationRoleId = db.get('verificationRole');
        const verificationMessageId = db.get('verificationMessage');

        if (!verificationChannelId || !verificationRoleId || !verificationMessageId) {
            return await interaction.reply({ content: 'The verification system is not set up.', ephemeral: true });
        }

        if (interaction.channelId !== verificationChannelId) {
            return await interaction.reply({ content: 'Please run the `/verify` command in the designated verification channel.', ephemeral: true });
        }

        const member = interaction.member;
        const role = interaction.guild.roles.cache.get(verificationRoleId);

        if (!role) {
            return await interaction.reply({ content: 'The verification role does not exist.', ephemeral: true });
        }

        if (member.roles.cache.has(verificationRoleId)) {
            return await interaction.reply({ content: 'You are already verified.', ephemeral: true });
        }

        await member.roles.add(role);

        const dmEmbed = new MessageEmbed()
            .setTitle('Verification Successful')
            .setDescription('You have successfully passed the verification.')
            .setColor('#68d19e')
            .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
            .setTimestamp();

        try {
            await interaction.reply({ content: 'Verification successful. Welcome!', ephemeral: true });
            await interaction.user.send({ embeds: [dmEmbed] });
        } catch (error) {
            console.error(`Failed to send DM to user ${interaction.user.tag}:`, error);
        }
    },
};
