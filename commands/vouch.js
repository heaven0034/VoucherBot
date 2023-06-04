const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vouch')
        .setDescription('📈 Give your opinion on the service you have purchased')
        .addUserOption(option => option.setName('member').setDescription('The member concerned').setRequired(true))
        .addStringOption(option => option.setName('service').setDescription('The service concerned').setRequired(true))
        .addIntegerOption(option => option.setName('note').setDescription('Score must be between 1 and 5').setRequired(true))
        .addStringOption(option => option.setName('reviews').setDescription('Your opinion').setRequired(true))
        .addStringOption(option => option.setName('image').setDescription('Image URL').setRequired(false)),
    async execute(interaction) {
        const member = interaction.options.getUser('member');
        const service = interaction.options.getString('service');
        const note = interaction.options.getInteger('note');
        const reviews = interaction.options.getString('reviews');
        const image = interaction.options.getString('image');

        if (note < 1 || note > 5) {
            return await interaction.reply({ content: 'Score must be between 1 and 5', ephemeral: true });
        }

        if (member.id !== '117381264826302464') { // Put your ID
            return await interaction.reply({ content: 'Only <@117381264826302464> can be vouched for.', ephemeral: true });
        }

        const requiredRole = '1114925913600180265'; 
        if (!interaction.member.roles.cache.has(requiredRole)) {
            return await interaction.reply({ content: 'Only members with the required role can use this command.', ephemeral: true });
        }

        const vouchData = {
            member: member.id,
            service,
            note,
            reviews,
            image,
            reviewer: interaction.user.id
        };

        db.push('vouches', vouchData);

        const avisEmbed = new MessageEmbed()
            .setTitle(`Reviews given by **${interaction.user.tag}**`)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addField('Member:', member.toString(), false)
            .addField('Service:', service, false)
            .addField('Note:', '⭐'.repeat(note), true)
            .addField('Reviews:', reviews, false)
            .setColor('#68d19e')
            .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
            .setTimestamp();

        if (image) {
            avisEmbed.setImage(image);
        }

        const avisChannel = interaction.guild.channels.cache.get('1114926135000711229');
        if (avisChannel) {
            avisChannel.send({ embeds: [avisEmbed] });
            await interaction.reply({ content: 'Your review has been sent successfully.', ephemeral: true });
        } else {
            await interaction.reply({ content: 'The notification channel was not found. Please contact <@117381264826302464>.', ephemeral: true });
        }
    },
};