import emojiData from "../../database/data/emoji.json";
import axios from 'axios';
import { PreFixCommands } from "../../cmds";

export = {
     name: "exchange",
     description: "để đổi tokens bot <@1115178351510954084>",
     aliases: ["ct", "ck"],

     callback: async (client, message, args) => {
          const toToken = parseInt(args[0]);

          const a = message.reply("<a:Loading:1181525113435336754>");
          const data = JSON.stringify({
               "collection": "balances",
               "database": "test",
               "dataSource": "Cluster0",
               "filter": {
                    "userId": `${message.author.id}`,
               },
               "update": {
                    "$inc": {
                         "token": toToken
                    }
               }
          });

          const config = {
               method: 'post',
               url: 'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-hjzdo/endpoint/data/v1/action/updateOne',
               headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Request-Headers': '*',
                    'api-key': 'olQQm5tPjQyZDwGSkFVL65txpFlpo3tahr0n59GooYs4SxvFsJbB9vB9qwe3poUh',
               },
               data: data
          };

          axios(config)
               .then(async function (response) {
                    await client.truTien(message.author.id, toToken);
                    (await a).edit(`Đổi thành công **${toToken}** ${emojiData.token} Tokens`);
               })
               .catch(async function (error) {
                    console.log(error);
                    (await a).edit(`Đổi thất bại! Vui lòng thử lại...`)
               });
     }
} as const as PreFixCommands