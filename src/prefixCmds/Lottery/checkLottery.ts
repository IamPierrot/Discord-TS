import { EmbedBuilder } from "discord.js";
import xoSoUserModel from "../../database/models/xoSoUserModel";
import { PreFixCommands } from "../../cmds";

export = {
     name: 'veso',
     aliases: ['vs'],
     description: "Xem vé số người dùng",

     callback: async (client, message, args) => {
          let data = await xoSoUserModel.findOne({ userId: message.author.id })
          if (!data) {
               data = new xoSoUserModel({
                    userId: message.author.id,
                    soLuong: []
               });
          }
          const amount = data.soLuong.length;

          const amountEmbed = new EmbedBuilder()
               .setTitle(`BẠN ĐANG CÓ ${amount} VÉ SỐ`)
               .setColor('Gold')
               .setTimestamp();

          amount > 0 ? amountEmbed.setDescription(`${data.soLuong.map((a, index) => `**${index + 1}.** ${a}`).join('\n')}`) : () => {};
          await message.reply({ embeds: [amountEmbed] });
     }
} as const as PreFixCommands;