import { PreFixCommands } from '../../cmds.js';
import chatLevelModel from '../../database/models/chatLvModel.js';
import voiceLevelModel from '../../database/models/voiceLvModel.js';
import { EmbedBuilder } from 'discord.js';

export = {
     name: "toplevel",
     description: 'Xem bảng xếp hạng Level',
     aliases: ['rank'],


     callback: async (client, message, args) => {
          const [chatData, voiceData] = await Promise.all([
               await chatLevelModel.find({ guildId: message.guildId }).sort({ level: -1 }),
               await voiceLevelModel.find({ guildId: message.guildId }).sort({ level: -1 })
          ]);

          const maxCount = args[0] ? parseInt(args[0]) : 10;
          const getIndex = (rank: number, object: any, index: number) => { object.userId == message.author.id ? rank = index : rank; return rank; };

          const rankChatLevel: number = chatData.reduce(getIndex, -1);
          const rankVoiceLevel: number = voiceData.reduce(getIndex, -1);

          const descriptionOfChat = chatData
               .slice(0, maxCount)
               .map((data, index) => { return `**${index + 1}.** <@${data.userId}> | **Cấp độ Chat** \`:\` \`${data.level}\`` })
               .join('\r\n\r\n');
          const descriptionOfVoice = voiceData
               .slice(0, maxCount)
               .map((data, index) => { return `**${index + 1}.** <@${data.userId}> | **Cấp độ Voice** \`:\` \`${data.level}\`` })
               .join('\r\n\r\n');

          // const leaderboardOfChat = new EmbedBuilder()
          //      .setAuthor({ name: `Bảng Xếp Hạng Chat`, iconURL: message.author.displayAvatarURL() })
          //      .setDescription(descriptionOfChat)
          //      .setColor('#2f3136')
          //      .setTimestamp()
          //      .setFooter({ text: `Xếp hạng của bạn #${rankChatLevel !== -1 ? rankChatLevel + 1 : 'unranked'}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          // const leaderboardOfVoice = new EmbedBuilder()
          //      .setAuthor({ name: `Bảng Xếp Hạng Voice`, iconURL: message.author.displayAvatarURL() })
          //      .setDescription(descriptionOfVoice)
          //      .setColor('#2f3136')
          //      .setTimestamp()
          //      .setFooter({ text: `Xếp hạng của bạn #${rankVoiceLevel !== -1 ? rankVoiceLevel + 1 : 'unranked'}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })


          const test = new EmbedBuilder()
               .setAuthor({ name: `Bảng Xếp Hạng Voice`, iconURL: message.author.displayAvatarURL() })
               .addFields([
                    {
                         name: "Bảng xếp hạng Level",
                         value: descriptionOfChat,
                         inline: true
                    },
                    {
                         name: "Bảng xếp hạng Voice",
                         value: descriptionOfVoice,
                         inline: true
                    }
               ])
               .setColor('#2f3136')
               .setTimestamp()
               .setFooter({ text: `Xếp hạng của bạn #${rankChatLevel !== -1 ? rankChatLevel + 1 : 'unranked'} | #${rankVoiceLevel !== -1 ? rankVoiceLevel + 1 : 'unranked'}`, iconURL: message.author.displayAvatarURL() })



          await message.reply({ embeds: [test] });
     }
} as const as PreFixCommands;