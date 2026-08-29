"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ping_1 = require("../commands/ping");
const yardim_1 = require("../commands/yardim");
const clear_1 = require("../commands/clear");
const ban_1 = require("../commands/ban");
const kick_1 = require("../commands/kick");
const kayit_1 = require("../commands/kayit");
const ticket_1 = require("../commands/ticket");
const unban_1 = require("../commands/unban");
const dmrol_1 = require("../commands/dmrol");
const ingame_1 = require("../commands/ingame");
const fivem_1 = require("../commands/fivem");
const idbak_1 = require("../commands/idbak");
const duyuru_1 = require("../commands/duyuru");
const mute_1 = require("../commands/mute");
const unmute_1 = require("../commands/unmute");
const telsiz_1 = require("../commands/telsiz");
const tagara_1 = require("../commands/tagara");
const mazeretPanel_1 = require("../utils/mazeretPanel");
const banAffPanel_1 = require("../utils/banAffPanel");
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
function updateIngameEmbed(interaction, action) {
    if (!interaction.isButton())
        return null;
    if (!interaction.message.embeds.length)
        return null;
    const oldEmbed = interaction.message.embeds[0];
    const description = oldEmbed.description ?? "";
    const parts = description.split("**Gelecekler:**");
    const mainMessage = parts[0].trim();
    const users = new Map();
    if (parts[1]) {
        const rows = parts[1]
            .split("\n")
            .map(x => x.trim())
            .filter(x => x.length &&
            x !== "Henüz kimse katılmadı.");
        for (const row of rows) {
            const match = row.match(/<@!?(\d+)>/);
            if (match) {
                users.set(match[1], `<@${match[1]}>`);
            }
        }
    }
    if (action === "join") {
        users.set(interaction.user.id, `<@${interaction.user.id}>`);
    }
    else {
        users.delete(interaction.user.id);
    }
    const list = users.size === 0
        ? "Henüz kimse katılmadı."
        : [...users.values()]
            .map((u, i) => `${i + 1}. ${u}`)
            .join("\n");
    return discord_js_1.EmbedBuilder.from(oldEmbed).setDescription(`${mainMessage}\n\n**Gelecekler:**\n${list}`);
}
exports.default = {
    name: discord_js_1.Events.InteractionCreate,
    async execute(interaction) {
        try {
            if (interaction.isChatInputCommand()) {
                if (interaction.commandName === 'ping')
                    return await (0, ping_1.execute)(interaction);
                if (interaction.commandName === 'yardim')
                    return await (0, yardim_1.execute)(interaction);
                if (interaction.commandName === 'clear')
                    return await (0, clear_1.execute)(interaction);
                if (interaction.commandName === 'ban')
                    return await (0, ban_1.execute)(interaction);
                if (interaction.commandName === 'kick')
                    return await (0, kick_1.execute)(interaction);
                if (interaction.commandName === 'mute')
                    return await (0, mute_1.execute)(interaction);
                if (interaction.commandName === 'unmute')
                    return await (0, unmute_1.execute)(interaction);
                if (interaction.commandName === 'kayıt' || interaction.commandName === 'kayit') {
                    return await (0, kayit_1.execute)(interaction);
                }
                if (interaction.commandName === 'ticket')
                    return await (0, ticket_1.execute)(interaction);
                if (interaction.commandName === 'unban')
                    return await (0, unban_1.execute)(interaction);
                if (interaction.commandName === 'dmrol')
                    return await (0, dmrol_1.execute)(interaction);
                if (interaction.commandName === 'ingame')
                    return await (0, ingame_1.execute)(interaction);
                if (interaction.commandName === 'fivem')
                    return await (0, fivem_1.execute)(interaction);
                if (interaction.commandName === 'idbak')
                    return await (0, idbak_1.execute)(interaction);
                if (interaction.commandName === 'duyuru')
                    return await (0, duyuru_1.execute)(interaction);
                if (interaction.commandName === 'telsiz')
                    return await (0, telsiz_1.execute)(interaction);
                if (interaction.commandName === 'tagara')
                    return await (0, tagara_1.execute)(interaction);
                return;
            }
            if (interaction.isButton() && interaction.customId === 'banaff_button') {
                return await (0, banAffPanel_1.handleBanAffButton)(interaction);
            }
            if (interaction.isModalSubmit() && interaction.customId === 'banaff_modal') {
                return await (0, banAffPanel_1.handleBanAffModal)(interaction);
            }
            if (interaction.isModalSubmit() && interaction.customId === 'mazeret_modal') {
                return await (0, mazeretPanel_1.handleMazeretModal)(interaction);
            }
            if (interaction.isButton() && interaction.customId === 'ingame_join') {
                const newEmbed = updateIngameEmbed(interaction, 'join');
                if (!newEmbed)
                    return;
                await interaction.update({
                    embeds: [newEmbed],
                    components: interaction.message.components
                });
                return;
            }
            if (interaction.isButton() && interaction.customId === 'ingame_leave') {
                const newEmbed = updateIngameEmbed(interaction, 'leave');
                if (!newEmbed)
                    return;
                await interaction.update({
                    embeds: [newEmbed],
                    components: interaction.message.components
                });
                return;
            }
            if (interaction.isButton() && interaction.customId === 'telsiz_kodu_ver') {
                const ilk = Math.floor(Math.random() * 90) + 10;
                const ikinci = Math.floor(Math.random() * 90) + 10;
                const kod = `${ilk}.${ikinci}`;
                await interaction.reply({
                    content: `@everyone\n📻 **Yeni Telsiz Kodu:** \`${kod}\``,
                    allowedMentions: { parse: ['everyone'] }
                });
                return;
            }
            if (interaction.isButton() && interaction.customId === 'ticket_close') {
                await interaction.reply({ content: 'Ticket 5 saniye içinde kapatılıyor...', ephemeral: true });
                setTimeout(async () => {
                    await interaction.channel?.delete().catch(() => null);
                }, 5000);
                return;
            }
            if (interaction.isButton() && interaction.customId === 'mazeret_button') {
                return await (0, mazeretPanel_1.handleMazeretButton)(interaction);
            }
            if (!interaction.isModalSubmit() && !interaction.isButton())
                return;
            if (!interaction.guild)
                return;
            if (interaction.isModalSubmit() && interaction.customId.startsWith('ticket_')) {
                const channel = await (0, channelManager_1.getLogChannel)(interaction.guild, 'ticket-log');
                await (0, logger_1.sendLog)(channel, '🎫 Ticket Oluşturuldu', 'Yeni bir ticket oluşturuldu', 0x3498db, [
                    { name: 'Kullanıcı', value: `${interaction.user} (${interaction.user.id})`, inline: true },
                    { name: 'Ticket ID', value: interaction.customId, inline: true },
                ]);
                (0, logger_1.saveLogToDatabase)('ticket-log', interaction.user.id, interaction.user.tag, 'TicketCreated', JSON.stringify({ ticketId: interaction.customId }));
            }
        }
        catch (error) {
            console.error('InteractionCreate event hatası:', error);
        }
    },
};
