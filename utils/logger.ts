import { EmbedBuilder, TextChannel } from 'discord.js';
import { db } from '../database/database';

export async function sendLog(
  channel: TextChannel | null,
  title: string,
  description: string,
  color: number = 0x3498db,
  fields?: Array<{ name: string; value: string; inline?: boolean }>
) {
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();

  if (fields) {
    embed.addFields(fields);
  }

  try {
    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error('Log gönderilirken hata:', error);
  }
}

export function saveLogToDatabase(
  channelName: string,
  userId: string | null,
  userTag: string | null,
  action: string,
  details: string | null = null
) {
  db.run(
    'INSERT INTO log_entries (channel_name, user_id, user_tag, action, details) VALUES (?, ?, ?, ?, ?)',
    [channelName, userId, userTag, action, details],
    (err) => {
      if (err) {
        console.error('Log veritabanına kaydedilirken hata:', err);
      }
    }
  );
}
