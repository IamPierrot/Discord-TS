import { PreFixCommands } from "../../cmds";

export = {
     name: 'coinflip',
     description: "chơi game tung đồng xu",
     tips: "+ Số tiền (hoặc all) + t hoặc h (tùy chọn)",
     example: "coinflip 100 t",
     aliases: ['cf'],

     callback: async (client, message, args) => {
          const author = message.author.id;
          const bal = await client.xemTien(author) as number;

          const soTien = args[0] === 'all' ? bal > 3e5 ? Math.round(3e5) : Math.round(bal) : parseInt(args[0]) ? parseInt(args[0]) : Math.round(bal * 0.25);
          if (soTien < 0) return message.reply("Deo duoc nhap so am");
          if (soTien > bal) return message.reply("Deo du tien dau ma choi");

          const statusCoin = {
               't': 'sấp',
               'h': 'ngửa'
          }
          const choices = Object.keys(statusCoin);

          const choose = args[1] ? args[1] : choices[Math.floor(Math.random() * choices.length)]; // h hoăc t ;v

          const rand = Math.round(Math.random()) == 1 ? 't' : 'h';
          rand == choose ? await client.addTien(author, soTien) : await client.truTien(author, soTien);

          await message.reply(`<a:coin_flip:1163073855540187177> Bạn cược **${soTien}** và chọn **${statusCoin[choose as keyof object]}**...`)
               .then(msg => {
                    setTimeout(() => {
                         msg.edit(`Đồng xu **mặt ${statusCoin[rand as keyof object]} và bạn ${rand == choose ? `thắng ${soTien * 2} <:Token:1181904336381562961> Vcoins` : 'mất hết rồi...'}** `);
                    }, 3000);
               })
     }
} as const as PreFixCommands;