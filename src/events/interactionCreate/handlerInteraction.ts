import { Interaction } from "discord.js";
import { BaseClient } from "../../utils/clients";

export = async (client: BaseClient, interaction: Interaction) => {
     if (!interaction.isChatInputCommand()) return;
     await interaction.deferReply();

     const commandObject = client.slashCommands.find(
          (cmd) => cmd.name === interaction.commandName
     );

     if (!commandObject) return;

     // if (commandObject.voiceChannel) {
     //      if (!interaction.member.voice.channel) {
     //           return await interaction.editReply({
     //                embeds: [new EmbedBuilder()
     //                     .setColor('#ff0000')
     //                     .setDescription(`❌ | Bạn đang không ở trong phòng Voice`)], ephemeral: true,
     //           })

     //      }
     //      if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
     //           return await interaction.editReply({
     //                embeds: [new EmbedBuilder()
     //                     .setColor('#ff0000')
     //                     .setDescription(`❌ | Bạn đang không ở cùng phòng voice với tui! `)], ephemeral: true,
     //           })
     //      }
     // }

     // if (commandObject.permissionsRequired?.length) {
     //      for (const permission of commandObject.permissionsRequired) {
     //           if (!interaction.member.permissions.has(permission)) {
     //                interaction.editReply({
     //                     content: 'Not enough permissions.',
     //                     ephemeral: true,
     //                });
     //                return;
     //           }
     //      }
     // }

     // if (commandObject.botPermissions?.length) {
     //      for (const permission of commandObject.botPermissions) {
     //           const bot = interaction.guild.members.me;

     //           if (!bot.permissions.has(permission)) {
     //                interaction.editReply({
     //                     content: "I don't have enough permissions.",
     //                     ephemeral: true,
     //                });
     //                return;
     //           }
     //      }
     // }
     await commandObject.callback(client, interaction);
}