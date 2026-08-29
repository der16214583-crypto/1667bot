"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("dmrol")
    .setDescription("Bir roldeki herkese DM gönderir")
    .addRoleOption(option => option
    .setName("rol")
    .setDescription("Mesaj gönderilecek rol")
    .setRequired(true))
    .addStringOption(option => option
    .setName("mesaj")
    .setDescription("Gönderilecek mesaj")
    .setRequired(true))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator);
async function execute(interaction) {
    const role = interaction.options.getRole("rol");
    const mesaj = interaction.options.getString("mesaj", true);
    await interaction.reply({
        content: `📨 ${role.name} rolündeki üyelere DM gönderiliyor...`,
        ephemeral: true,
    });
    let basarili = 0;
    let basarisiz = 0;
    const members = await interaction.guild.members.fetch();
    for (const [, member] of members) {
        if (member.roles.cache.has(role.id) && !member.user.bot) {
            try {
                await member.send(mesaj);
                basarili++;
            }
            catch {
                basarisiz++;
            }
        }
    }
    await interaction.followUp({
        content: `✅ ${basarili} kişiye gönderildi\n❌ ${basarisiz} kişiye gönderilemedi`,
        ephemeral: true,
    });
}
