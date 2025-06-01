const { getGridFS } = require('./connections/mongoDb');
const Deck = require('./models/deck');
const mongoose = require('mongoose');
const { Readable } = require('stream');

async function getAllByUser(userId) {
    try {
        return await Deck.find({ userId });
    } catch (err) {
        throw err;
    }
}

async function getOne(id, userId) {
    try {
        return await Deck.findOne({
            _id: new mongoose.Types.ObjectId(id),
            userId: userId
        });
    } catch (err) {
        throw err;
    }
}

async function createDeck(cards, name, userId) {
    console.log("Creating deck with name:", name, "for userId:", userId);
    console.log("Cards to be saved:", cards);
    try {
        const deck = new Deck({
            name,
            userId,
            fileIds: []
        });
        for (const card of cards) {
            const file = await saveDeckToGridFS(card.base64, userId);
            deck.fileIds.push(file._id);
        }
        await deck.save();
        return deck;
    } catch (err) {
        console.error("Error in createDeck:", err);
        throw err;
    }
}

async function updateDeck(id, userId, updateData) {
    try {
        const updated = await Deck.findOneAndUpdate(
            { _id: id, userId },
            updateData,
            { new: true }
        );
        return updated;
    } catch (err) {
        throw err;
    }
}

async function deleteDeck(id, userId) {
    try {
        const result = await Deck.deleteOne({ _id: id, userId });
        return result.deletedCount > 0;
    } catch (err) {
        throw err;
    }
}

//----------------------------Supporting functions for file storage----------------------------

async function saveDeckToGridFS(base64, userId) {
    const gfs = getGridFS();
    const buffer = Buffer.from(base64, 'base64');
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);


    return new Promise((resolve, reject) => {
        const uploadStream = gfs.openUploadStream("card", {
            metadata: { userId }
        });

        let fileId = uploadStream.id;

        uploadStream
            .on('error', reject)
            .on('finish', () => resolve({
                _id: fileId,
                metadata: { userId }
            }));


        readable.pipe(uploadStream);
    });
}

module.exports = {
    getAllByUser,
    getOne,
    createDeck,
    updateDeck,
    deleteDeck,
};
