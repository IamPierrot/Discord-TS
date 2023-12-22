declare interface Config extends Record<string, unknown> {
     "MONGO": string,
     "app": {
          "token": string,
          "global": boolean,
          "guild": string,
          "ExtraMessages": boolean,
          "loopMessage": boolean,
          "client": string,
          "prefix": string
     },
     "opt": {
          "idDev": Array<string>
          "maxVol": number,
          "spotifyBridge": boolean,
          "volume": number,
          "leaveOnEmpty": boolean,
          "leaveOnEmptyCooldown": number,
          "leaveOnEnd": boolean,
          "leaveOnEndCooldown": number,
          "discordPlayer": {
               "ytdlOptions": {
                    "quality": string,
                    "highWaterMark": number
               }
          }
     },
     "levelSystems": {
          "xp": number,
          "cooldown": number,
          "extraXP": number
     }
}

declare var configure : Config;