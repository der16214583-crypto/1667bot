"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLog = sendLog;
exports.saveLogToDatabase = saveLogToDatabase;
const discord_js_1 = require("discord.js");
const database_1 = require("../database/database");
async function sendLog(channel, title, description, color = 0x3498db, fields) {
    if (!channel)
        return;
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
    if (fields) {
        embed.addFields(fields);
    }
    try {
        await channel.send({ embeds: [embed] });
    }
    catch (error) {
        console.error('Log gönderilirken hata:', error);
    }
}
function saveLogToDatabase(channelName, userId, userTag, action, details = null) {
    database_1.db.run('INSERT INTO log_entries (channel_name, user_id, user_tag, action, details) VALUES (?, ?, ?, ?, ?)', [channelName, userId, userTag, action, details], (err) => {
        if (err) {
            console.error('Log veritabanına kaydedilirken hata:', err);
        }
    });
}
