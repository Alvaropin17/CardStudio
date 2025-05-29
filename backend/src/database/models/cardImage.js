const mongoose = require('mongoose');
const Template = require('./template');

const cardImageSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  templateId: { type: Number, required: true }, 
  csvId: { type: Number, required: true },
  name: { type: String, required: true },
  base64: { type: String, required: true },
});

module.exports = mongoose.model('CardImage', cardImageSchema);  