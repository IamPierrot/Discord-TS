import { Client, EmbedBuilder, GuildMember, Guild, BaseInteraction } from "discord.js";
import getLocalCommands from '../../utils/getLocalCommands';

export default async (client: Client, interaction: any) => {
     try {
          const member : GuildMember = interaction.member;

          if (!interaction.isChatInputCommand()) return;
          const localCommands = getLocalCommands();

          const commandObject: any= localCommands.find(
               (cmd: any) => cmd.name === interaction.commandName
          );


          if (!commandObject) return;

          if (commandObject.voiceChannel) {
               
               if (!member.voice) {
                    return await interaction.reply({
                         embeds: [new EmbedBuilder().
                              setColor('#ff0000')
                              .setDescription(`❌ | Bạn đang không ở trong phòng Voice`)], ephemeral: true,
                    })

               }
               if (interaction.guild?.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
                    return await interaction.reply({
                         embeds: [new EmbedBuilder()
                              .setColor('#ff0000')
                              .setDescription(`❌ | Bạn đang không ở cùng phòng voice với tui! `)], ephemeral: true,
                    })
               }
          }

          if (commandObject.permissionsRequired?.length) {
               for (const permission of commandObject.permissionsRequired) {
                    if (!interaction.member.permissions.has(permission)) {
                         interaction.reply({
                              content: 'Not enough permissions.',
                              ephemeral: true,
                         });
                         return;
                    }
               }
          }

          if (commandObject.botPermissions?.length) {
               for (const permission of commandObject.botPermissions) {
                    const bot = interaction.guild.members.me;

                    if (!bot.permissions.has(permission)) {
                         interaction.reply({
                              content: "I don't have enough permissions.",
                              ephemeral: true,
                         });
                         return;
                    }
               }
          }
          await commandObject.callback(client, interaction);
     } catch (error) {
          console.log(`There was an error running command: ${error} `);
     }


}