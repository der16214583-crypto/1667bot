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
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
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
                if (interaction.commandName === 'kayıt')
                    return await (0, kayit_1.execute)(interaction);
                if (interaction.commandName === 'ticket')
                    return await (0, ticket_1.execute)(interaction);
                if (interaction.commandName === 'unban')
                    return await (0, unban_1.execute)(interaction);
                return;
            }
            if (interaction.isButton() && interaction.customId === 'ticket_close') {
                await interaction.reply({ content: 'Ticket 5 saniye içinde kapatılıyor...', ephemeral: true });
                setTimeout(async () => {
                    await interaction.channel?.delete().catch(() => null);
                }, 5000);
                return;
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
