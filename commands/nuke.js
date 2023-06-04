const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('💣 Nuke a channel')
        .addChannelOption(option => option.setName('channel').setDescription('Channel to nuke').setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');

        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return await interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
        }

        if (!channel.isText()) {
            return await interaction.reply({ content: 'Please select a text channel.', ephemeral: true });
        }

        await interaction.deferReply();

        const position = channel.position;
        const channelData = {
            name: channel.name,
            topic: channel.topic,
            nsfw: channel.nsfw,
            rateLimitPerUser: channel.rateLimitPerUser,
            parent: channel.parentId,
            permissionOverwrites: channel.permissionOverwrites.cache.map(overwrite => ({
                id: overwrite.id,
                type: overwrite.type,
                allow: overwrite.allow.toArray(),
                deny: overwrite.deny.toArray()
            }))
        };

        const newChannel = await channel.clone();
        await channel.delete();
        await newChannel.edit(channelData);
        await newChannel.setPosition(position);

        await newChannel.send('Channel nuked successfully!');
    },
};
