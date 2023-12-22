import { Partials, GatewayIntentBits } from 'discord.js';
import { BaseClient } from './utils/clients';
import eventHandlers from './handlers/eventHandler';
import { mongoSetup } from './database/dbSetup';
globalThis.configure = require('../config.json');

const client = new BaseClient({
     intents: Object.keys(GatewayIntentBits) as keyof object,
     partials: Object.keys(Partials) as keyof object
});

Promise.all([
     mongoSetup(),
     eventHandlers(client) //handler the event
]);

client.login(configure.app.token);