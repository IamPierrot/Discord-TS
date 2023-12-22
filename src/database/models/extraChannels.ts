import mongoose from 'mongoose';

const extraChannelSchema = new mongoose.Schema({
     guildId: String,
     chatChannelId: [],
     voiceChannelId: [],
})

const extraChannelModel = mongoose.model("extraXpChannel", extraChannelSchema);

export = extraChannelModel;