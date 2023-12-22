import { EmbedBuilder, Message, PermissionsBitField } from "discord.js";
import { BaseClient } from "../../utils/clients";

export = async (client: BaseClient, message: Message) => {
     try {
          if (message.author.bot) return;

          const checkPrefix = (prefix: string): boolean => message.content.toLowerCase().startsWith(prefix.toLowerCase());

          let prefix = client.prefix;
          const prefixAuth = await client.getPrefix(message.guildId!);
          if (prefixAuth && !checkPrefix(prefix)) prefix = prefixAuth;

          if (!checkPrefix(prefix)) return;

          const args = message.content.slice(prefix.length).trim().split(/ +/);
          const command = args.shift()!.toLowerCase();

          const commandObject = client.prefixCommands.find(
               (cmd) => cmd.name === command || cmd.aliases?.includes(command)
          );
          if (!commandObject || !message.member) return;
          if (commandObject?.adminOnly && (!configure.opt.idDev.includes(message.author.id) || !message.member.permissions.has([PermissionsBitField.Flags.Administrator]))) return message.reply("Bạn không có quyền dùng lệnh này!");

          if (commandObject?.DJPermissions && (!message.member.permissions.has([PermissionsBitField.Flags.MoveMembers, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.MuteMembers]))) return message.reply("Bạn không có quyền dùng lệnh này!");
          if (commandObject?.voiceChannel) {
               if (!message.member.voice.channel) return await message.reply({ embeds: [new EmbedBuilder().setColor('#ff0000').setDescription(`❌ | Bạn đang không ở trong phòng Voice`)] })
               if (message.guild!.members.me?.voice.channel && message.member.voice.channel.id !== message.guild!.members.me.voice.channel.id) return await message.reply({ embeds: [new EmbedBuilder().setColor('#ff0000').setDescription(`❌ | Bạn đang không ở cùng phòng voice với tui! `)] })
          }

          return await commandObject.callback(client, message, args);
     } catch (error) {
          console.log(`There was an error in message handler: ${error}`)
     }

}