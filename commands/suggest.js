const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('📈 Submit a suggestion for improvement')
        .addStringOption(option => option.setName('suggestion').setDescription('Your suggestion').setRequired(true)),
    async execute(interaction) {
        const suggestion = interaction.options.getString('suggestion');

        db.push('suggestions', suggestion);

        const suggestionEmbed = new MessageEmbed()
            .setColor('#68d19e')
            .setTitle(`Suggestion given by **${interaction.user.tag}**`)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addField('Suggestion:', '```' + suggestion + '```')
            .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
            .setTimestamp();

        const suggestionsChannel = interaction.guild.channels.cache.get('1114925741738557440');
        if (suggestionsChannel) {
            suggestionsChannel.send({ embeds: [suggestionEmbed] });
            await interaction.reply('Your suggestion has been submitted successfully. Thank you!');
        } else {
            await interaction.reply('The suggestions channel was not found. Please contact the server administrator.');
        }
    },
};
