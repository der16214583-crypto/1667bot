"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('ingame')
    .setDescription('Butonlu ingame çağrısı gönderir')
    .addStringOption(option => option
    .setName('mesaj')
    .setDescription('Çağrı mesajı')
    .setRequired(true))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator);
async function execute(interaction) {
    const mesaj = interaction.options.getString('mesaj', true);
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('📢 Ingame Çağrısı')
        .setDescription(`${mesaj}\n\n**Gelecekler:**\nHenüz kimse katılmadı.`)
        .setColor(0x2ecc71)
        .setFooter({ text: `Çağıran: ${interaction.user.tag}` })
        .setTimestamp();
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
        .setCustomId('ingame_join')
        .setLabel('Katıl')
        .setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder()
        .setCustomId('ingame_leave')
        .setLabel('Ayrıl')
        .setStyle(discord_js_1.ButtonStyle.Danger));
    await interaction.reply({
        embeds: [embed],
        components: [row]
    });
}
