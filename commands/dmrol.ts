import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  Role,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("dmrol")
  .setDescription("Bir roldeki herkese DM gönderir")
  .addRoleOption(option =>
    option
      .setName("rol")
      .setDescription("Mesaj gönderilecek rol")
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName("mesaj")
      .setDescription("Gönderilecek mesaj")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  const role = interaction.options.getRole("rol") as Role;
  const mesaj = interaction.options.getString("mesaj", true);

  await interaction.reply({
    content: `📨 ${role.name} rolündeki üyelere DM gönderiliyor...`,
    ephemeral: true,
  });

  let basarili = 0;
  let basarisiz = 0;

  const members = await interaction.guild!.members.fetch();

  for (const [, member] of members) {
    if (member.roles.cache.has(role.id) && !member.user.bot) {
      try {
        await member.send(mesaj);
        basarili++;
      } catch {
        basarisiz++;
      }
    }
  }

  await interaction.followUp({
    content: `✅ ${basarili} kişiye gönderildi\n❌ ${basarisiz} kişiye gönderilemedi`,
    ephemeral: true,
  });
}