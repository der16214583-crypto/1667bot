"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config/config");
const ping_1 = require("./commands/ping");
const yardim_1 = require("./commands/yardim");
const clear_1 = require("./commands/clear");
const ban_1 = require("./commands/ban");
const kick_1 = require("./commands/kick");
const kayit_1 = require("./commands/kayit");
const ticket_1 = require("./commands/ticket");
const unban_1 = require("./commands/unban");
const dmrol_1 = require("./commands/dmrol");
const ingame_1 = require("./commands/ingame");
const fivem_1 = require("./commands/fivem");
const idbak_1 = require("./commands/idbak");
const tagara_1 = require("./commands/tagara");
const duyuru_1 = require("./commands/duyuru");
const mute_1 = require("./commands/mute");
const unmute_1 = require("./commands/unmute");
const telsiz_1 = require("./commands/telsiz");
const commands = [
    ping_1.data.toJSON(),
    yardim_1.data.toJSON(),
    clear_1.data.toJSON(),
    ban_1.data.toJSON(),
    kick_1.data.toJSON(),
    kayit_1.data.toJSON(),
    ticket_1.data.toJSON(),
    unban_1.data.toJSON(),
    dmrol_1.data.toJSON(),
    ingame_1.data.toJSON(),
    fivem_1.data.toJSON(),
    idbak_1.data.toJSON(),
    tagara_1.data.toJSON(),
    duyuru_1.data.toJSON(),
    mute_1.data.toJSON(),
    unmute_1.data.toJSON(),
    telsiz_1.data.toJSON(),
];
const rest = new discord_js_1.REST({ version: '10' }).setToken(config_1.config.token);
(async () => {
    try {
        console.log('Slash komutları yükleniyor...');
        await rest.put(discord_js_1.Routes.applicationGuildCommands(config_1.config.clientId, config_1.config.guildId), {
            body: commands,
        });
        console.log('Slash komutları başarıyla yüklendi.');
    }
    catch (error) {
        console.error('Komut yükleme hatası:', error);
    }
})();
