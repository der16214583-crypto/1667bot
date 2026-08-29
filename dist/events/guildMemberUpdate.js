"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const channelManager_1 = require("../utils/channelManager");
const logger_1 = require("../utils/logger");
exports.default = {
    name: discord_js_1.Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        try {
            if (!newMember.user)
                return;
            // Rol değişikliklerini kontrol et
            if (!oldMember.roles || !newMember.roles)
                return;
            const oldRoles = oldMember.roles.cache;
            const newRoles = newMember.roles.cache;
            if (oldRoles.size !== newRoles.size) {
                const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
                const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));
                if (addedRoles.size > 0 || removedRoles.size > 0) {
                    const channel = await (0, channelManager_1.getLogChannel)(newMember.guild, 'rol-log');
                    const fields = [
                        { name: 'Kullanıcı', value: `${newMember.user} (${newMember.user.id})`, inline: true },
                    ];
                    if (addedRoles.size > 0) {
                        fields.push({
                            name: '✅ Eklenen Roller',
                            value: addedRoles.map(r => r.name).join(', ') || 'Yok',
                            inline: false,
                        });
                    }
                    if (removedRoles.size > 0) {
                        fields.push({
                            name: '❌ Kaldırılan Roller',
                            value: removedRoles.map(r => r.name).join(', ') || 'Yok',
                            inline: false,
                        });
                    }
                    await (0, logger_1.sendLog)(channel, '🎭 Rol Değişikliği', 'Bir kullanıcının rolleri değiştirildi', 0x9b59b6, fields);
                    (0, logger_1.saveLogToDatabase)('rol-log', newMember.user.id, newMember.user.tag, 'GuildMemberUpdate', JSON.stringify({
                        added: Array.from(addedRoles.keys()),
                        removed: Array.from(removedRoles.keys()),
                    }));
                }
            }
            // Güvenlik logları için özel kontroller
            const securityChannel = await (0, channelManager_1.getLogChannel)(newMember.guild, 'security-log');
            // İsim değişikliği
            if (oldMember.displayName && newMember.displayName && oldMember.displayName !== newMember.displayName) {
                await (0, logger_1.sendLog)(securityChannel, '🔒 İsim Değişikliği', 'Bir kullanıcının ismi değiştirildi', 0xff6b6b, [
                    { name: 'Kullanıcı', value: `${newMember.user} (${newMember.user.id})`, inline: true },
                    { name: 'Eski İsim', value: oldMember.displayName, inline: true },
                    { name: 'Yeni İsim', value: newMember.displayName, inline: true },
                ]);
                (0, logger_1.saveLogToDatabase)('security-log', newMember.user.id, newMember.user.tag, 'NameChange', JSON.stringify({
                    oldName: oldMember.displayName,
                    newName: newMember.displayName,
                }));
            }
            // Avatar değişikliği
            if (oldMember.user && newMember.user && oldMember.user.avatar !== newMember.user.avatar) {
                await (0, logger_1.sendLog)(securityChannel, '🖼️ Avatar Değişikliği', 'Bir kullanıcının avatarı değiştirildi', 0xff6b6b, [
                    { name: 'Kullanıcı', value: `${newMember.user} (${newMember.user.id})`, inline: true },
                    { name: 'Yeni Avatar', value: newMember.user.displayAvatarURL(), inline: false },
                ]);
                (0, logger_1.saveLogToDatabase)('security-log', newMember.user.id, newMember.user.tag, 'AvatarChange', JSON.stringify({ newAvatar: newMember.user.displayAvatarURL() }));
            }
        }
        catch (error) {
            console.error('GuildMemberUpdate event hatası:', error);
        }
    },
};
