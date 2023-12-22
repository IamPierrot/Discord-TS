import { PreFixCommands } from "../../cmds";

export = {
     name: 'give',
     description: "Chuyển tiền cho người khác!",
     tips: "+ @ten + số tiền",
     aliases: ['pay'],

     callback: async (client, message, args) => {
          const author = message.author.id;
          let toGiveUser = message.mentions.users.first();
          let soTien = parseInt(args[1]);
          const bal = await client.xemTien(author);
          if (!toGiveUser) return await message.reply("Người bạn ping không tồn tại...");
          if (soTien < 0) return message.reply("Bạn không thể nhập số tiền âm");
          if (soTien > bal) return message.reply("Nghèo còn bày đặt đi cho tiền người khác");

          await client.truTien(author, soTien);
          await client.addTien(toGiveUser.id, soTien);
          await message.reply(`Đã chuyển cho ${toGiveUser} ${soTien}`);
     }
} as const as PreFixCommands;