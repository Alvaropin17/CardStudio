const express = require('express');
const answer = require('../../red/answers');
const userService = require('../users/userService');

const { verifyToken, checkUserPermission } = require('../auth/authService');

const cardImageService = require('./cardImageService');

const router = express.Router({ mergeParams: true });


router.get('/', verifyToken, getAllImages);
router.get('/:id', verifyToken, checkUserPermission, getImageById);
router.post('/', verifyToken, checkUserPermission, createImage);
router.put('/:id', verifyToken, checkUserPermission, updateImage);
router.delete('/:id', verifyToken, checkUserPermission, deleteImage);

//TODO: check in all controller if user exists before proceeding with the request

async function getAllImages(req, res) {
    const userId = req.params.userId;

    try {
        const images = await cardImageService.getAllImagesByUser(userId);
        return answer.success(req, res, images, 200);
    } catch (err) {
        return answer.error(req, res, "Error when obtaining the images", 500);
    }
}

async function getImageById(req, res) {
    const userId = req.params.userId;
    const id = req.params.id;


    try {
        const image = await cardImageService.getImageById(id, userId);
        if (!image) {
            return answer.error(req, res, "Image not found", 404);
        }
        return answer.success(req, res, image, 200);
    } catch (err) {
        return answer.error(req, res, "Error when obtaining the images", 500);
    }
}

async function createImage(req, res) {
    const body = req.body;
    const userId = req.params.userId;

    if (!body.name || !body.base64) {
        return answer.error(req, res, "Missing mandatory fields", 400);
    }

    try {

        const user = await userService.getUserById(userId);
        if (!user) {
            return answer.error(req, res, "User not found", 404);
        }
        const saved = await cardImageService.createImage(body, userId);
        return answer.success(req, res, saved, 201);
    } catch (err) {
        return answer.error(req, res, "Error when creating the image", 500);
    }
}

async function updateImage(req, res) {
    const body = req.body;
    const id = req.params.id;
    const userId = req.params.userId;

    try {
        const existing = await cardImageService.getImageById(id, userId);
        if (!existing) {
            return answer.error(req, res, "Image not found", 404);
        }

        const updated = await cardImageService.updateImage(req.body, id, userId);
        return answer.success(req, res, updated, 200);
    } catch (err) {
        return answer.error(req, res, "Error when updating the template", 500);
    }
}

async function deleteImage (req, res){
    const id = req.params.id;
    const userId = req.params.userId;

    try {
        const success = await cardImageService.deleteImage(id, userId);
        if (!success) {
            return answer.error(req, res, "Image not found", 404);
        }
        return answer.success(req, res, success, 200);
    } catch (err) {
        return answer.error(req, res, "Error when deleting the image", 500);
        
    }
}

module.exports = router;
