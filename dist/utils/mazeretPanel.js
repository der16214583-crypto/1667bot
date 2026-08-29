"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMazeretPanel = sendMazeretPanel;
exports.handleMazeretButton = handleMazeretButton;
exports.handleMazeretModal = handleMazeretModal;
const discord_js_1 = require("discord.js");
const MAZERET_PANEL_CHANNEL_ID = '1507902327414067270';
const MAZERET_LOG_CHANNEL_ID = '1533943935435538593';
async function sendMazeretPanel(client) {
    const channel = await client.channels.fetch(MAZERET_PANEL_CHANNEL_ID).catch(() => null);
    if (!channel || channel.type !== discord_js_1.ChannelType.GuildText) {
        console.log('Mazeret panel kanalı bulunamadı.');
        return;
    }
    const textChannel = channel;
    const messages = await textChannel.messages.fetch({ limit: 20 }).catch(() => null);
    const alreadyExists = messages?.some(msg => msg.author.id === client.user.id &&
        msg.embeds[0]?.title === 'Mazeret Bildirimi');
    if (alreadyExists) {
        console.log('Mazeret paneli zaten var, tekrar gönderilmedi.');
        return;
    }
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('Mazeret Bildirimi')
        .setDescription('Mazereti olan kişiler aşağıdaki butona basarak mazeretlerini yönetime iletebilir.')
        .setColor(0xf1c40f)
        .setFooter({ text: 'Mazeret Sistemi' })
        .setTimestamp();
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
        .setCustomId('mazeret_button')
        .setLabel('Mazeret')
        .setEmoji('📝')
        .setStyle(discord_js_1.ButtonStyle.Secondary));
    await textChannel.send({
        embeds: [embed],
        components: [row]
    });
    console.log('Mazeret paneli gönderildi.');
}
async function handleMazeretButton(interaction) {
    const modal = new discord_js_1.ModalBuilder()
        .setCustomId('mazeret_modal')
        .setTitle('Mazeret Bildirimi');
    const reason = new discord_js_1.TextInputBuilder()
        .setCustomId('mazeret_reason')
        .setLabel('Mazeret sebebi nedir?')
        .setStyle(discord_js_1.TextInputStyle.Paragraph)
        .setRequired(true);
    const duration = new discord_js_1.TextInputBuilder()
        .setCustomId('mazeret_duration')
        .setLabel('Mazeret süresi ne kadar?')
        .setPlaceholder('Örnek: 1 gün, 3 gün, 1 hafta')
        .setStyle(discord_js_1.TextInputStyle.Short)
        .setRequired(true);
    modal.addComponents(new discord_js_1.ActionRowBuilder().addComponents(reason), new discord_js_1.ActionRowBuilder().addComponents(duration));
    await interaction.showModal(modal);
}
async function handleMazeretModal(interaction) {
    const reason = interaction.fields.getTextInputValue('mazeret_reason');
    const duration = interaction.fields.getTextInputValue('mazeret_duration');
    const logChannel = await interaction.client.channels.fetch(MAZERET_LOG_CHANNEL_ID).catch(() => null);
    if (!logChannel || logChannel.type !== discord_js_1.ChannelType.GuildText) {
        await interaction.reply({
            content: 'Mazeret log kanalı bulunamadı.',
            ephemeral: true
        });
        return;
    }
    const now = new Date();
    const tarih = now.toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('📝 Yeni Mazeret')
        .setColor(0xf1c40f)
        .addFields({ name: 'Kullanıcı', value: `${interaction.user} (${interaction.user.id})`, inline: false }, { name: 'Durum', value: 'MAZERETLİ', inline: true }, { name: 'Süre', value: duration, inline: true }, { name: 'Tarih', value: tarih, inline: false }, { name: 'Mazeret Sebebi', value: reason, inline: false })
        .setFooter({ text: `${interaction.user.username} mazeretli` })
        .setTimestamp();
    await logChannel.send({
        content: `${interaction.user} mazeret bildirdi.`,
        embeds: [embed]
    });
    await interaction.reply({
        content: '✅ Mazeretin yönetime iletildi.',
        ephemeral: true
    });
}
