"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const YETKILI_ROL_ID = '1463878100533117066';
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('kick')
    .setDescription('Bir kullanıcıyı sunucudan atar')
    .addUserOption(option => option.setName('kullanici').setDescription('Atılacak kullanıcı').setRequired(true))
    .addStringOption(option => option.setName('sebep').setDescription('Atma sebebi').setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.KickMembers);
async function execute(interaction) {
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    if (!member || !member.roles.cache.has(YETKILI_ROL_ID)) {
        await interaction.reply({ content: 'Bu komutu kullanmak için yetkin yok.', ephemeral: true });
        return;
    }
    const user = interaction.options.getUser('kullanici', true);
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';
    const targetMember = await interaction.guild?.members.fetch(user.id).catch(() => null);
    if (!targetMember) {
        await interaction.reply({ content: 'Kullanıcı sunucuda bulunamadı.', ephemeral: true });
        return;
    }
    try {
        await targetMember.kick(reason);
        await interaction.reply(`✅ ${user.tag} sunucudan atıldı. Sebep: ${reason}`);
    }
    catch (error) {
        await interaction.reply({ content: 'Kullanıcı atılamadı. Botun yetkisini ve rol sırasını kontrol et.', ephemeral: true });
    }
}
