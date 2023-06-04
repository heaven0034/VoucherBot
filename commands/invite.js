const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('📩 Create an invitation for the current channel'),
    async execute(interaction) {
        const channel = interaction.channel;

        const invite = await channel.createInvite({
            maxUses: 50, // Nombre maximal d'utilisations de l'invitation
            unique: true // Génère une nouvelle URL unique à chaque fois
        });

        const inviteEmbed = new MessageEmbed()
            .setTitle('Invite Created')
            .setDescription(`Here's an invitation link for the current channel: ${invite.url}`)
            .setColor('#68d19e')
            .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
            .setTimestamp();

        await interaction.reply({ embeds: [inviteEmbed] });
    },
};
