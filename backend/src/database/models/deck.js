const mongoose = require('mongoose');

const DeckSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    name: { type: String, required: true },
    fileIds: {
        type: [mongoose.Types.ObjectId],
        required: true,
        default: []
    }

});

module.exports = mongoose.model('Deck', DeckSchema);  