import { Client, Partials, IntentsBitField } from 'discord.js';
import eventHandlers from './handlers/eventHandler';
import { app } from '../config.json'

const client = new Client({
     intents: [
          IntentsBitField.Flags.GuildMembers,
          IntentsBitField.Flags.GuildMessages,
          IntentsBitField.Flags.MessageContent,
          IntentsBitField.Flags.Guilds,
          IntentsBitField.Flags.GuildVoiceStates,
          IntentsBitField.Flags.GuildModeration
     ],
     partials: [
          Partials.Channel,
          Partials.Message,
          Partials.User,
          Partials.GuildMember,
     ],
});
eventHandlers(client); //handler the event

client.login(app.token);