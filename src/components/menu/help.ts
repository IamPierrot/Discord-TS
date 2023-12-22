import { EmbedBuilder } from 'discord.js';
import path from 'path';
import sourceEmoji from '../../database/data/emoji.json';
import { PreFixCommands } from '../../cmds';
import { StringSelectMenuComponent } from '../../component';

export = {
     name: "help",
     callback: async (client, interaction, values) => {

          if (values[0] === "Admin" && !configure.opt.idDev.includes(interaction.user.id)) {
               return await interaction.editReply({
                    embeds: [
                         new EmbedBuilder()
                              .setAuthor({ name: `❌ Menu hướng dẫn này không phải dành cho bạn!` })
                    ],
               })
          }
          const commandCategoriesPaths = client.getAllFiles(
               path.join(__dirname, '..', '..', 'prefixCmds'),
               true
          );

          async function createEmbedForCommand(category: string) {
               const commandObjects: PreFixCommands[] = [];
               const commandCategories = commandCategoriesPaths.filter(value => value.split("\\").pop() === category);
               for (const commandCategory of commandCategories) {
                    const commandFiles = client.getAllFiles(commandCategory);

                    for (const commandFile of commandFiles) {
                         const commandObject: PreFixCommands = require(commandFile);
                         if (commandObject?.showHelp === false) continue;
                         commandObjects.push(commandObject);
                    }
               }

               const fields = (commandObject: PreFixCommands[]) => {

                    return commandObject.map(element => {
                         return {
                              name: `**Cách dùng** : \`${configure.app.prefix} ${element.name} ${element?.tips ? element.tips : ''}\` ${element?.adminOnly ? `<:Moderators:1129122776800821259>` : ''}`,
                              value: `${element.description} - Các lệnh rút gọn : \`${element?.aliases ? element.aliases : "Không có"}\``,
                              inline: false
                         }
                    })
               }
               const nameOfCommand = (commandObject: PreFixCommands[]) => {
                    return commandObject.map(element => `\`${element.name}\``).join(' , ')
               }

               const emoji = sourceEmoji.emoji;
               const [field, name] = await Promise.all([
                    fields(commandObjects),
                    nameOfCommand(commandObjects)
               ]);

               const resultEmbed = new EmbedBuilder()
                    .setTitle(`${emoji[category as keyof object]} ${category} - (${commandObjects.length}) ${name}`)
                    .addFields(field)
                    .setTimestamp()
                    .setFooter({ text: `Prefix của bot là ${configure.app.prefix}`, iconURL: client.user!.displayAvatarURL() });


               return resultEmbed;
          }

          await interaction.editReply({ embeds: [await createEmbedForCommand(values[0])] });
     }
} as const as StringSelectMenuComponent;