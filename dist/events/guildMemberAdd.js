"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const KAYITSIZ_ROL_ID = '1511719799108010125';
exports.default = {
    name: discord_js_1.Events.GuildMemberAdd,
    async execute(member) {
        try {
            await member.roles.add(KAYITSIZ_ROL_ID);
        }
        catch (err) {
            console.error(err);
        }
    },
};
