"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const TICKET_CATEGORY_ID = '1511365886903062698';
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticket oluşturur');
async function execute(interaction) {
    const guild = interaction.guild;
    if (!guild)
        return;
    const channelName = `ticket-${interaction.user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const existing = guild.channels.cache.find(ch => ch.name === channelName);
    if (existing) {
        await interaction.reply({ content: `Zaten açık ticketın var: ${existing}`, ephemeral: true });
        return;
    }
    try {
        const channel = await guild.channels.create({
            name: channelName,
            type: discord_js_1.ChannelType.GuildText,
            parent: TICKET_CATEGORY_ID,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: [discord_js_1.PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [
                        discord_js_1.PermissionFlagsBits.ViewChannel,
                        discord_js_1.PermissionFlagsBits.SendMessages,
                        discord_js_1.PermissionFlagsBits.ReadMessageHistory,
                    ],
                },
            ],
        });
        const closeButton = new discord_js_1.ButtonBuilder()
            .setCustomId('ticket_close')
            .setLabel('Ticket Kapat')
            .setStyle(discord_js_1.ButtonStyle.Danger);
        const row = new discord_js_1.ActionRowBuilder().addComponents(closeButton);
        await channel.send({
            content: `${interaction.user} ticket oluşturdu. Yetkililer birazdan ilgilenecek.`,
            components: [row],
        });
        await interaction.reply({ content: `✅ Ticket oluşturuldu: ${channel}`, ephemeral: true });
    }
    catch (error) {
        await interaction.reply({ content: 'Ticket oluşturulamadı. Kategori ID veya bot yetkilerini kontrol et.', ephemeral: true });
    }
}
