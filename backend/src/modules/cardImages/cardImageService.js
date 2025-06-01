const cardImageRepository = require('../../database/cardImageRepository');
const CardImage = require('../../database/models/cardImage');

async function getAllImagesByUser(userId) {
    return await cardImageRepository.getAllByUser(userId);
}

async function getImageById(id, userId) {
    return await cardImageRepository.getOne(id, userId);
}

async function createImage(body, userId) {
    const { name, base64 } = body;
    return await cardImageRepository.createImage(base64, name, userId);
}

async function updateImage(body, id, userId) {
    const existing = await cardImageRepository.getOne(id, userId);
    if (!existing) return null;

    const updatedFields = {
        name: body.name || existing.name,
        base64: body.base64 || existing.base64
    };

    return await cardImageRepository.updateImage(id, userId, updatedFields);
}

async function deleteImage(id, userId) {
    return await cardImageRepository.deleteImage(id, userId);
}

module.exports = {
    getAllImagesByUser,
    getImageById,
    createImage,
    updateImage,
    deleteImage
};
