const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('customer')
        .setDescription('⭐ Assigns the Customer role')
        .addUserOption(option => option.setName('user').setDescription('User to assign the role to').setRequired(true)),
    async execute(interaction) {
        const roleId = '1114925913600180265'; // Put roleID

        if (interaction.user.id !== '117381264826302464') { // Put your ID
            return await interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const customerRole = interaction.guild.roles.cache.get(roleId);

        if (!customerRole) {
            return await interaction.reply({ content: 'The Customer role was not found.', ephemeral: true });
        }

        try {
            await interaction.guild.members.cache.get(user.id).roles.add(customerRole);
            await interaction.reply(`The role <@&1112716025721528371> has been assigned to ${user.tag}.`);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while assigning the role.', ephemeral: true });
        }
    },
};
