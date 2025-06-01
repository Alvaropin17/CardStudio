const mongoose = require('mongoose');

const cardImageSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    name: { type: String, required: true },
    fileId: { type: mongoose.Types.ObjectId, required: true }, 

});

module.exports = mongoose.model('CardImage', cardImageSchema);  