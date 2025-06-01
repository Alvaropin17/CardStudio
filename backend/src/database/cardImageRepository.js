const { gfs } = require('../database/connections/mongoDb');
const CardImage = require('./models/cardImage');
const mongoose = require('mongoose');
const { Readable } = require('stream');

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

async function createImage(base64, name, userId) {
    try {
        const file = await saveImageToGridFS(base64, name, userId);
        console.log("File saved to GridFS with ID:", file._id);
        const cardImage = new CardImage({
            name,
            userId,
            fileId: file._id // Nuevo campo que debes agregar al modelo
        });

        await cardImage.save();
        return cardImage;
    } catch (err) {
        console.error("Error in createImage:", err);
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

//----------------------------Supporting functions for file storage----------------------------

async function saveImageToGridFS(base64, filename, userId) {
    const buffer = Buffer.from(base64, 'base64');
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);


    return new Promise((resolve, reject) => {
        const uploadStream = gfs.openUploadStream(filename, {
            metadata: { userId }
        });

        let fileId = uploadStream.id;

        uploadStream
            .on('error', reject)
            .on('finish', () => resolve({
                _id: fileId,
                filename: filename,
                metadata: { userId }
            }));


        readable.pipe(uploadStream);
    });
}

module.exports = {
    getAllByUser,
    getOne,
    createImage,
    updateImage,
    deleteImage,
};
