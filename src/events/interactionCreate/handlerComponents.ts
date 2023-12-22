import { Interaction } from "discord.js";

import { EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import { BaseClient } from "../../utils/clients";

/**
 * 
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').Interaction} interaction
 * @returns 
 */

export = async (client: BaseClient, interaction: Interaction) => {
     try {
          if (!interaction.isMessageComponent()) return;
          await interaction.deferReply({ ephemeral: true });

          // const interactionId = client.components.get(interaction.member.id) || null;

          // if (interactionId && interaction.customId !== interactionId) return await interaction.editReply("Này cái này không phải dành cho bạn");

          if (interaction.isButton()) {

               const customId = interaction.customId;
               const musicCustomId = JSON.parse(customId);
               const musicButtonName = musicCustomId.ffb;

               if (musicButtonName) {
                    const queue = useQueue(interaction.guild!);
                    const noMusic = new EmbedBuilder()
                         .setAuthor({ name: 'Không có gì đang phát ấy ? thử lại ikkk.... ❌' })

                    if (!queue || !queue.isPlaying() || !queue.currentTrack) return await interaction.editReply({ embeds: [noMusic] });

                    if (musicButtonName && interaction.user.id === queue.currentTrack.requestedBy!.id) {
                         const button = client.components.buttons.find((cpt) => cpt.name === musicButtonName);
                         if (button) await button.callback(client, interaction, customId, queue);
                    } else {
                         await interaction.editReply({
                              embeds: [
                                   new EmbedBuilder()
                                        .setAuthor({ name: `❌ Mấy cái nút không phải dành cho bạn` })
                                        .setDescription(`Bài hát này là yêu cầu của : ${queue.currentTrack.requestedBy!.toString()}`)
                              ],
                         }).then(() => setTimeout(() => interaction.deleteReply(), 10000))
                    }

               }

               // chưa dùng
               // if (buttonName) {
               //      delete require.cache[require.resolve(`../../components/buttons/${buttonName}.js`)];
               //      const button = require(`../../components/buttons/${buttonName}.js`);
               //      if (button) await button({ client, interaction, customId });
               // }
          }

          if (interaction.isStringSelectMenu()) {
               const menuName = interaction.customId;
               const values = interaction.values;

               if (menuName) {
                    const menu = client.components.menus.find((m) => m.name === menuName);
                    if (menu) await menu.callback(client, interaction, values);
               }
               // setTimeout(() => client.components.delete(interaction.member.id), 60000);
          }

     } catch (error) {
          console.log(`There was an Error when running handle Components: ${error}`)
     }
}