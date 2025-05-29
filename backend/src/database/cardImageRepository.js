const CardImage = require('./models/cardImage');
const mongoose = require('mongoose');

async function getAllByUser(userId) {
    try {
        return await CardImage.find({ userId });
    } catch (err) {
        throw err;
    }
}

async function getOne(id, userId) {
    try {
        return await CardImage.findOne({
            _id: new mongoose.Types.ObjectId(id),
            userId: userId
        });
    } catch (err) {
        throw err;
    }
}

async function createImage(imageData) {
    try {
        const image = new CardImage(imageData);
        await image.save();
        return image;
    } catch (err) {
        throw err;
    }
}

async function updateImage(id, userId, updateData) {
    try {
        const updated = await CardImage.findOneAndUpdate(
            { _id: id, userId },
            updateData,
            { new: true }
        );
        return updated;
    } catch (err) {
        throw err;
    }
}

async function deleteImage(id, userId) {
    try {
        const result = await CardImage.deleteOne({ _id: id, userId });
        return result.deletedCount > 0;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getAllByUser,
    getOne,
    createImage,
    updateImage,
    deleteImage,
};
