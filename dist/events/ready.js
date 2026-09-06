"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const voice_1 = require("@discordjs/voice");
const channelManager_1 = require("../utils/channelManager");
const banAffPanel_1 = require("../utils/banAffPanel");
const mazeretPanel_1 = require("../utils/mazeretPanel");
const config_1 = require("../config/config");
const VOICE_CHANNEL_ID = '1511779616992526420';
exports.default = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Bot hazır! ${client.user?.tag} olarak giriş yapıldı.`);
        await (0, banAffPanel_1.sendBanAffPanel)(client);
        await (0, mazeretPanel_1.sendMazeretPanel)(client);
        const channel = client.channels.cache.get(VOICE_CHANNEL_ID);
        if (channel && channel.isVoiceBased()) {
            (0, voice_1.joinVoiceChannel)({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: true,
                selfMute: true,
            });
            console.log('Bot ses kanalına bağlandı.');
        }
        else {
            console.log('Ses kanalı bulunamadı.');
        }
        for (const [guildId, guild] of client.guilds.cache) {
            try {
                console.log(`Sunucu kontrol ediliyor: ${guild.name} (${guildId})`);
                if (guildId !== config_1.config.guildId) {
                    console.log(`Bu sunucu ana sunucu değil, atlanıyor.`);
                    continue;
                }
                const me = guild.members.me;
                if (!me)
                    continue;
                const permissions = me.permissions;
                if (!permissions.has('ManageChannels') ||
                    !permissions.has('ViewChannel') ||
                    !permissions.has('SendMessages')) {
                    console.log(`${guild.name} sunucusunda yeterli izin yok!`);
                    continue;
                }
                await (0, channelManager_1.createLogChannels)(guild);
                console.log(`${guild.name} sunucusunda log kanalları hazır!`);
            }
            catch (error) {
                console.error(`${guild.name} sunucusunda hata:`, error);
            }
        }
    },
};
