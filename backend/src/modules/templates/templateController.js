const express = require('express');
const answer = require('../../red/answers');

const { verifyToken, checkUserPermission } = require('../auth/authService');
const templateService = require('../templates/templateService');
const userService = require('../users/userService');

const router = express.Router({ mergeParams: true });

router.get('/', verifyToken, getAllTemplates);
router.get('/:id', verifyToken, checkUserPermission, getTemplateById);
router.post('/', verifyToken, checkUserPermission, createTemplate);
router.put('/:id', verifyToken, checkUserPermission, updateTemplate);
router.post('/:id/csv/:csvId', verifyToken, checkUserPermission, assignCsvToTemplate); // check csv permission too
router.delete('/:id', verifyToken, checkUserPermission, deleteTemplate);

async function getAllTemplates(req, res) {
    const userId = req.params.userId;

    try {
        const templates = await templateService.getAllTemplatesByUser(userId);
        return answer.success(req, res, templates, 200);
    } catch (error) {
        return answer.error(req, res, "Error when obtaining the templates", 500);
    }
}

async function getTemplateById(req, res) {
    const userId = req.params.userId;
    const id = req.params.id;

    try {
        const template = await templateService.getTemplateById(id, userId);
        if (!template) {
            return answer.error(req, res, "Template not found", 404);
        }
        return answer.success(req, res, template, 200);
    } catch (error) {
        return answer.error(req, res, "Error when obtaining the template", 500);
    }
}

async function createTemplate(req, res) {
    const body = req.body;
    const userId = req.params.userId;

    if (!body.name || !body.canvas_json) {
        return answer.error(req, res, "Missing mandatory fields", 400);
    }

    try {

        const user = await userService.getUserById(userId);
        if (!user) {
            return answer.error(req, res, "User not found", 404);
        }
        const saved = await templateService.createTemplate(body, user.id);
        return answer.success(req, res, saved, 201);
    } catch (error) {
        return answer.error(req, res, "Error when creating the template", 500);
    }
}


async function updateTemplate(req, res) {
    const body = req.body;
    const id = req.params.id;
    const userId = req.params.userId;

    try {
        const existing = await templateService.getTemplateById(id, userId);
        if (!existing) {
            return answer.error(req, res, "Template not found", 404);
        }
        const updated = await templateService.updateTemplate(body, id, userId);
        return answer.success(req, res, updated, 200);
    } catch (error) {
        return answer.error(req, res, "Error when updating the template", 500);
    }
}

async function deleteTemplate(req, res) {
    const id = req.params.id;
    const userId = req.params.userId;

    try {
        const success = await templateService.deleteTemplate(id, userId);
        if (!success) {
            return answer.error(req, res, "Template not found", 404);
        }
        return answer.success(req, res, success, 200);
    } catch (error) {
        return answer.error(req, res, "Error when deleting the template", 500);
    }
}

async function assignCsvToTemplate(req, res) {
    const templateId = req.params.id;
    const csvId = req.params.csvId;
    const userId = req.params.userId;



    try {
        const template = await templateService.getTemplateById(templateId, userId);
        if (!template) {
            return answer.error(req, res, "Template not found", 404);
        }

        await templateService.assignCsvToTemplate(templateId, csvId);
        return answer.success(req, res, "CSV assigned successfully", 200);
    } catch (error) {
        return answer.error(req, res, "Error when assigning the template to the CSV", 500);
    }
}

module.exports = router;
