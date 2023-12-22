import { ActivityOptions, ActivityType } from "discord.js";
import { BaseClient } from "../../utils/clients";

const status : ActivityOptions[] = [
     {
          name: 'Youtube 🎧',
          type: ActivityType.Streaming,
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
     },
     {
          name: 'Spotify 🎧',
          type: ActivityType.Streaming,
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
     },
     {
          name: 'soundCloud 🎧',
          type: ActivityType.Streaming,
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
     },
]

export = async (client: BaseClient) => {
     
     if (!client.user) throw new Error('Cook');
     console.log(`✅ Sucessfully logged into ${client.user.tag}!.`);

     setInterval(() => {
          const random = Math.floor(Math.random() * status.length);
          client.user!.setActivity(status[random]);
     }, 10000)
}