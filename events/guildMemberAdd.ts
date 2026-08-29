import { Events, GuildMember } from 'discord.js';

const KAYITSIZ_ROL_ID = '1511719799108010125';

export default {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember) {
    try {
      await member.roles.add(KAYITSIZ_ROL_ID);
    } catch (err) {
      console.error(err);
    }
  },
};
