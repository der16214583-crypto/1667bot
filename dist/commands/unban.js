"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const YETKILI_ROL_ID = '1463878100533117066';
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('unban')
    .setDescription('ID ile kullanıcının banını kaldırır')
    .addStringOption(option => option
    .setName('id')
    .setDescription('Banı kaldırılacak kullanıcının IDsi')
    .setRequired(true))
    .addStringOption(option => option
    .setName('sebep')
    .setDescription('Ban kaldırma sebebi')
    .setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers);
async function execute(interaction) {
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    if (!member || !member.roles.cache.has(YETKILI_ROL_ID)) {
        await interaction.reply({ content: 'Bu komutu kullanmak için yetkin yok.', ephemeral: true });
        return;
    }
    const userId = interaction.options.getString('id', true);
    const reason = interaction.options.getString('sebep') || 'Ban kaldırıldı';
    if (!/^\d{17,20}$/.test(userId)) {
        await interaction.reply({ content: 'Geçerli bir kullanıcı ID gir.', ephemeral: true });
        return;
    }
    try {
        await interaction.guild?.members.unban(userId, reason);
        await interaction.reply(`✅ Ban kaldırıldı: \`${userId}\`\nSebep: ${reason}`);
    }
    catch (error) {
        await interaction.reply({
            content: 'Ban kaldırılamadı. ID yanlış olabilir, kullanıcı banlı olmayabilir veya botun yetkisi yok.',
            ephemeral: true
        });
    }
}
