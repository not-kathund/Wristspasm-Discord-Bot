const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const { Player } = require("discord-player");

const command = {
    data: new SlashCommandBuilder()
        .setName("cat")
        .setDescription("(Admin Command) View the contents of a file")
        .addStringOption(option => option.setName("file").setDescription("File name").setRequired(true)),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     * @param {Player} player
     */
    async execute(interaction, client, hypixel, player) {
        if (!interaction.memberPermissions.has("ADMINISTRATOR") && !interaction.member.roles.includes(interaction.guild.roles.cache.get(cfg.admin_role_id))) {
            interaction.reply("You do not have permission to use this command!");
            return;
        }

        const file = interaction.options.getString("file");
        fs.readFile(`data/${file}`, (err, data) => {
            if (err) {
                console.error(err);
                interaction.reply(`There was an error while running this command, Console Error: \`${err}\``);
                return;
            }

            const fileData = `File contents of \`data/${file}\`\n\`\`\`${data}\`\`\``;

            if (fileData.length <= 2000) {
                interaction.reply(fileData);
            } else {
                interaction.reply({ files: [ `data/${file}` ] });
            }

        });
    }
}

module.exports = command;
