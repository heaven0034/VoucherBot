const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const emojis = require('../emojis.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('✅ Displays the command list'),
    execute(interaction) {
        const mainEmbed = new MessageEmbed()
            .setColor('#68d19e')
            .setDescription(`Click on the button of your choice to display the appropriate help page.`)
            .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
            .setTimestamp();

        const helpButton = new MessageButton()
            .setCustomId('helpButton')
            .setLabel('Complete help')
            .setStyle('SUCCESS');

        const paginationButton = new MessageButton()
            .setCustomId('paginationButton')
            .setLabel('Paged help (Not yet available)')
        	.setDisabled(true)
            .setStyle('DANGER');

        const buttonRow = new MessageActionRow().addComponents(helpButton, paginationButton);

        const interactionFilter = (i) => i.customId === 'helpButton';

        const collector = interaction.channel.createMessageComponentCollector({ interactionFilter, time: 15000 });

        collector.on('collect', (i) => {
            const replyEmbed = new MessageEmbed()
                .setColor('#68d19e')
                .setTitle('Commands available 📝')
                .setDescription(`Here's the list of available commands.`)
                .addFields(
                    { name: `👑 Bot Owner - (2)`, value: `${emojis.dot} </setup-verify:1114883740074774593> *Setup verification system.*\n${emojis.dot} </customer:1114883740074774588> *Assigns the Customer role.*` },
                    { name: `🔨 Administrator - (2)`, value: `${emojis.dot} </mass-role:1114883740074774590> *Add or remove a role from all users.*\n${emojis.dot} </nuke:1114883740074774591> *Nuke a channel.*` },
                    { name: `⭐ Customer - (1)`, value: `${emojis.dot} </vouch:1114910378829299782> *Give your opinion on the service you have purchased.*` },
                    { name: `🌐 Everyone - (4)`, value: `${emojis.dot} </help:1114881414299668531> *Displays the command list.*\n${emojis.dot} </invite:1114883740074774589> *Create an invitation for the server.*\n${emojis.dot} </payment:1114883740074774592> *Displays payment options.*\n${emojis.dot} </suggest:1114883740074774594> *Submit a suggestion for improvement.*\n${emojis.dot} </verify:1114883740074774595> *Verify yourself.*` },
                )
                .setFooter(interaction.client.user.username, interaction.client.user.displayAvatarURL())
                .setTimestamp();

            i.reply({ embeds: [replyEmbed] });
            collector.stop();
        });

        interaction.reply({ embeds: [mainEmbed], components: [buttonRow] });
    },
};
