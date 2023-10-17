import { Client } from "discord.js";
import getAllFiles from "../utils/getAllFiles";
import path from "path";

export default (client: Client) => {

     const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

     for (const eventFolder of eventFolders) {
          const eventFiles = getAllFiles(eventFolder);
          eventFiles.sort((a, b) => a > b ? 1 : -1);

          const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();

          if (!eventName) {
               return;
          }

          client.on(eventName, async (arg1, arg2, arg3, arg4) => {
               for (const eventFile of eventFiles) {
                    const eventFunction : Function = require(eventFile);
                    await eventFunction(client, arg1, arg2, arg3, arg4);
                    delete require.cache[require.resolve(eventFile)];
               }
          });
     }

}