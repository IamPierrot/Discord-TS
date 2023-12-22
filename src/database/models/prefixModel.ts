import mongoose from 'mongoose';


const prefixSchema = new mongoose.Schema({
     prefix: { type: String, required: true },
     guildId: String
})
const prefixModel = mongoose.model('prefix', prefixSchema);

export = prefixModel;