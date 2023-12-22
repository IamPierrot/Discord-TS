import { PreFixCommands } from "../../cmds";

import { EmbedBuilder } from "discord.js";

export = {
     name: 'balance',
     description: "xem số tiền hiện có trong túi",
     aliases: ['bal', 'cash', 'coin'],
     
     callback: async (client, message, args) => {
          const author = message.author.id;
          const balance = await client.xemTien(author);
          const msg = new EmbedBuilder().setDescription(`**Bạn đang có |** ${balance} <:Token:1181904336381562961> **Vcoins**`);
          await message.reply({ embeds: [msg] });
     }
} as const as PreFixCommands