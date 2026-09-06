import { REST, Routes } from 'discord.js';
import { config } from './config/config';

import { data as ping } from './commands/ping';
import { data as yardim } from './commands/yardim';
import { data as clear } from './commands/clear';
import { data as ban } from './commands/ban';
import { data as kick } from './commands/kick';
import { data as kayit } from './commands/kayit';
import { data as ticket } from './commands/ticket';
import { data as unban } from './commands/unban';
import { data as dmrol } from './commands/dmrol';
import { data as ingame } from './commands/ingame';
import { data as fivem } from './commands/fivem';
import { data as idbak } from './commands/idbak';
import { data as tagara } from './commands/tagara';
import { data as duyuru } from './commands/duyuru';
import { data as mute } from './commands/mute';
import { data as unmute } from './commands/unmute';
import { data as telsiz } from './commands/telsiz';

const commands = [
  ping.toJSON(),
  yardim.toJSON(),
  clear.toJSON(),
  ban.toJSON(),
  kick.toJSON(),
  kayit.toJSON(),
  ticket.toJSON(),
  unban.toJSON(),
  dmrol.toJSON(),
  ingame.toJSON(),
  fivem.toJSON(),
  idbak.toJSON(),
  tagara.toJSON(),
  duyuru.toJSON(),
  mute.toJSON(),
  unmute.toJSON(),
  telsiz.toJSON(),
];

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    console.log('Slash komutları yükleniyor...');

    await rest.put(
      Routes.applicationGuildCommands(
        config.clientId,
        config.guildId
      ),
      {
        body: commands,
      }
    );

    console.log('Slash komutları başarıyla yüklendi.');
  } catch (error) {
    console.error('Komut yükleme hatası:', error);
  }
})();
