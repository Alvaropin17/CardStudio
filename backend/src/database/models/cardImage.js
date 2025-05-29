const mongoose = require('mongoose');

const cardImageSchema = new mongoose.Schema({
  userId: { type: Number, required: true },     
  name: { type: String, required: true },
  base64: { type: String, required: true },
});

module.exports = mongoose.model('CardImage', cardImageSchema);  