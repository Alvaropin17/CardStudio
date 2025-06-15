const deckRepository = require('./DeckRepository');

async function getAllDecksByUser(userId) {
    return await deckRepository.getAllByUser(userId);
}

async function getDeckById(id, userId) {
    return await deckRepository.getOne(id, userId);
}

async function createDeck(body, userId) {
    const { name, cards } = body;
    return await deckRepository.createDeck(cards, name, userId);
}

async function updateDeck(body, id, userId) {
    const existing = await deckRepository.getOne(id, userId);
    if (!existing) return null;

    const updatedFields = {
        name: body.name || existing.name,
        cards: body.cards || existing.cards
    };

    return await deckRepository.updateDeck(id, userId, updatedFields);
}

async function deleteDeck(id, userId) {
    return await deckRepository.deleteDeck(id, userId);
}

module.exports = {
    getAllImagesByUser: getAllDecksByUser,
    getImageById: getDeckById,
    createImage: createDeck,
    updateImage: updateDeck,
    deleteImage: deleteDeck
};
