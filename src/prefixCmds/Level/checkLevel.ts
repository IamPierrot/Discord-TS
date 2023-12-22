import { EmbedBuilder } from 'discord.js';
import chatLevelModel from '../../database/models/chatLvModel';
import voiceLevelModel from '../../database/models/voiceLvModel';
import extraChannelModel from '../../database/models/extraChannels';
import { duration } from 'moment';
import { PreFixCommands } from '../../cmds';
import 'moment-duration-format';
/////
export = {
     name: "level",
     description: "xem level trong máy chủ hiện tại",

     callback: async (client, message, args) => {
          const [chatData, voiceData] = await Promise.all([
               await chatLevelModel.findOne({ userId: message.author.id, guildId: message.guildId }),
               await voiceLevelModel.findOne({ userId: message.author.id, guildId: message.guildId })
          ]);

          const [rankChatLevelData, rankVoiceLevelData] = await Promise.all([
               await chatLevelModel.find({ guildId: message.guildId }).sort({ level: -1 }),
               await voiceLevelModel.find({ guildId: message.guildId }).sort({ level: -1 })
          ]);

          const extraChannelData = await extraChannelModel.findOne({ guildId: message.guildId });

          const embedError = new EmbedBuilder()
               .setAuthor({ name: 'Có vẻ bạn chưa có dữ liệu levels! Vui lòng thử lại sau...' })
               .setColor('Red')
          if (!extraChannelData || !chatData || !voiceData || !rankChatLevelData || !rankVoiceLevelData) return await message.reply({ embeds: [embedError] }).then((msg) => setTimeout(() => msg.delete(), 5000));

          const getIndex = (rank: number, object: any, index: number) => { object.userId == message.author.id ? rank = index : rank; return rank; };

          const rankChatLevel = rankChatLevelData.reduce(getIndex, -1);
          const rankVoiceLevel = rankVoiceLevelData.reduce(getIndex, -1);

          const chatLevel = chatData?.level ? chatData.level : 'unknown';
          const totalText = chatData?.totalText ? chatData.totalText : 'unknown';
          const chatExp = (chatData?.xp && chatData?.nextLevel) ? `${chatData.xp} / ${chatData.nextLevel}` : 'unknown';

          const voiceLevel = voiceData?.level ? voiceData.level : 'unknown';
          const durations = voiceData?.totalTime ? duration(voiceData.totalTime).format(" D [ngày], H [giờ], m [phút], s [giây]") : 'unknown';
          const voiceExp = (voiceData?.xp && voiceData?.nextLevel) ? `${voiceData.xp} / ${voiceData.nextLevel}` : 'unknown';

          function createExpValue(level: number | string, exp: string) {
               return `\`\`\`elm\nLevel : ${level}\nExp: ${exp}\n\`\`\``
          }

          const formatChannelId = (channelId: string) => {
               return message.guild!.channels.cache.get(channelId)?.toString();
          }

          let desc = "";
          desc = `${desc + "> "} **Tên Người dùng:** ${message.author.toString()}\n`;
          desc = `${desc + "> "} **Channel Chat Buff:** ${extraChannelData?.chatChannelId.length >= 1 ? extraChannelData.chatChannelId.map((elm) => formatChannelId(elm)).join(", ") : "Không có"}\n`;
          desc = `${desc + "> "} **Channel Voice Buff:** ${extraChannelData?.voiceChannelId.length >= 1 ? extraChannelData.voiceChannelId.map((elm) => formatChannelId(elm)).join(", ") : "Không có"}\n`;
          // desc = `${desc + "> "} **Tổng số Roles:** ${rolesCount}\n`;
          desc += "\n";
          const embed = new EmbedBuilder()
               .setTitle("BẢNG THÔNG TIN CẤP ĐỘ")
               .setColor("Random")
               .setDescription(desc)
               .setTimestamp()
               .addFields(
                    {
                         name: `<:NQG_chat:1165586565549006858> **CẤP ĐỘ TIN NHẮN**`,
                         value: createExpValue(chatLevel, chatExp),
                         inline: true,
                    },
                    {
                         name: `<:NQG_mic:1165586547094061107> **CẤP ĐỘ VOICE**`,
                         value: createExpValue(voiceLevel, voiceExp),
                         inline: true,
                    },
                    {
                         name: `<:huyhieuj:1137002449736040528> **SỐ NGƯỜI ĐÃ THAM GIA**`,
                         value: `\`\`\`elm\nText: ${rankChatLevelData.length} | Voice: ${rankVoiceLevelData.length}\n\`\`\``,
                         inline: false,
                    },
                    {
                         name: "**<:NQG_thang:1137034260642005113> XẾP HẠNG TIN NHẮN**",
                         value: `\`\`\`#${rankChatLevel !== -1 ? rankChatLevel + 1 : 'unranked'}\`\`\``,
                         inline: true,
                    },
                    {
                         name: "<:NQG_thang:1137034260642005113> **XẾP HẠNG VOICE**",
                         value: `\`\`\`#${rankVoiceLevel !== -1 ? rankVoiceLevel + 1 : 'unranked'}\`\`\``,
                         inline: true,
                    },
                    {
                         name: `**THÔNG SỒ**`,
                         value: `\`\`\`Số từ đã nhắn : ${totalText} từ\nThời gian trong voice : ${durations}\`\`\``,
                         inline: false,
                    }
               );
          /////////////////////////////////////////////
          await message.reply({ embeds: [embed] });
     }
} as const as PreFixCommands;