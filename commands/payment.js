const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('payment')
        .setDescription('💲 Displays payment options'),
    async execute(interaction) {
        const paymentEmbed = new MessageEmbed()
            .setTitle('Payment Options')
            .addField('PayPal', 'https://paypal.me/cesdior')
            .addField('LTC', 'M8zvJPt3CqhZhUBr6zVYtYA9BatqLLTVbM')
            .addField('BTC', '3KwLL6bGvseXUiTf8TkeXAzBrU51YmgKyZ')
            .addField('Ethereum', '0x824ACB318c2E2e0Ae15dFc84DE11E05e30E52037')
            .setColor('#68d19e')
            .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
            .setTimestamp();

        await interaction.reply({ embeds: [paymentEmbed] });
    },
};
