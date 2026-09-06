"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBanAffPanel = sendBanAffPanel;
exports.handleBanAffButton = handleBanAffButton;
exports.handleBanAffModal = handleBanAffModal;
const discord_js_1 = require("discord.js");
const BAN_AFF_PANEL_CHANNEL_ID = '1508836073315500173';
const BAN_AFF_TICKET_CATEGORY_ID = '1511505866942316737';
async function sendBanAffPanel(client) {
    const channel = await client.channels.fetch(BAN_AFF_PANEL_CHANNEL_ID).catch(() => null);
    if (!channel || channel.type !== discord_js_1.ChannelType.GuildText) {
        console.log('Ban affı panel kanalı bulunamadı.');
        return;
    }
    const textChannel = channel;
    const messages = await textChannel.messages.fetch({ limit: 20 }).catch(() => null);
    const alreadyExists = messages?.some(msg => msg.author.id === client.user.id &&
        msg.embeds[0]?.title === 'Ban Affı Bekleyenler');
    if (alreadyExists) {
        console.log('Ban affı paneli zaten var, tekrar gönderilmedi.');
        return;
    }
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('Ban Affı Bekleyenler')
        .setDescription('Ekibimizde banlı olan kişiler için banları daha düzenli tutmak için banları artık buradan gönderiyoruz.')
        .setColor(0xf1c40f)
        .setTimestamp();
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
        .setCustomId('banaff_button')
        .setLabel('Banlıyım!')
        .setEmoji('🖊️')
        .setStyle(discord_js_1.ButtonStyle.Secondary));
    await textChannel.send({
        embeds: [embed],
        components: [row]
    });
    console.log('Ban affı paneli gönderildi.');
}
async function handleBanAffButton(interaction) {
    const modal = new discord_js_1.ModalBuilder()
        .setCustomId('banaff_modal')
        .setTitle('Ban Affı Başvurusu');
    const reason = new discord_js_1.TextInputBuilder()
        .setCustomId('reason')
        .setLabel('Neden banlandın?')
        .setStyle(discord_js_1.TextInputStyle.Paragraph)
        .setRequired(true);
    const bannedId = new discord_js_1.TextInputBuilder()
        .setCustomId('banned_id')
        .setLabel('Banlı kullanıcı ID')
        .setStyle(discord_js_1.TextInputStyle.Short)
        .setRequired(true);
    modal.addComponents(new discord_js_1.ActionRowBuilder().addComponents(reason), new discord_js_1.ActionRowBuilder().addComponents(bannedId));
    await interaction.showModal(modal);
}
async function handleBanAffModal(interaction) {
    if (!interaction.guild)
        return;
    const reason = interaction.fields.getTextInputValue('reason');
    const bannedId = interaction.fields.getTextInputValue('banned_id');
    const safeName = interaction.user.username
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '');
    const channelName = `ban-affi-${safeName}`;
    const existing = interaction.guild.channels.cache.find((ch) => ch.name === channelName);
    if (existing) {
        await interaction.reply({
            content: `Zaten açık ban affı başvurun var: ${existing}`,
            ephemeral: true
        });
        return;
    }
    const channel = await interaction.guild.channels.create({
        name: channelName,
        type: discord_js_1.ChannelType.GuildText,
        parent: BAN_AFF_TICKET_CATEGORY_ID,
        permissionOverwrites: [
            {
                id: interaction.guild.roles.everyone.id,
                deny: [discord_js_1.PermissionFlagsBits.ViewChannel]
            },
            {
                id: interaction.user.id,
                allow: [
                    discord_js_1.PermissionFlagsBits.ViewChannel,
                    discord_js_1.PermissionFlagsBits.SendMessages,
                    discord_js_1.PermissionFlagsBits.ReadMessageHistory
                ]
            }
        ]
    });
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('🖊️ Ban Affı Başvurusu')
        .setColor(0xf1c40f)
        .addFields({ name: 'Başvuran', value: `${interaction.user} (${interaction.user.id})`, inline: false }, { name: 'Banlı Kullanıcı ID', value: bannedId, inline: false }, { name: 'Neden Banlandın?', value: reason, inline: false })
        .setTimestamp();
    await channel.send({
        content: 'Yeni ban affı başvurusu oluşturuldu.',
        embeds: [embed]
    });
    await interaction.reply({
        content: `✅ Ban affı başvurun oluşturuldu: ${channel}`,
        ephemeral: true
    });
}
