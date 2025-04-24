const express = require('express');
const answer = require('../../red/answers');


const { verifyToken, checkUserPermission } = require('../auth/authService');
const templateService = require('../templates/templateService'); 
const userService = require('../users/userService');

const router = express.Router({ mergeParams: true });

router.get('/', getAllTemplates);
router.get('/:id', getTemplateById);
router.post('/', verifyToken, checkUserPermission, createTemplate);
router.put('/:id', verifyToken, checkUserPermission, updateTemplate);
router.delete('/:id', verifyToken, checkUserPermission, deleteTemplate);

//TO DO: FIX ALL OF THIS

async function getAllTemplates(req, res) {
    const userId = req.params.userId;
    
    try {
        const templates = await templateService.getAllTemplatesByUser(userId);
        return answer.success(req, res, templates, 200);
        
        //res.json(templates.map(t => t.toJSON()));
    } catch (error) {
        return answer.error(req, res, "Error when obtaining the templates", 500);
        //res.status(500).json({ error: 'Error al obtener las plantillas', details: error });
    }
}

async function getTemplateById(req, res) {
    const userId = req.params.userId;
    const id = req.params.id;

    console.log('userId', userId);
    console.log('id', id);

    try {
        const template = await templateService.getTemplateById(id, userId);
        if (!template) {
            return answer.error(req, res, "Template not found", 404);
            //return res.status(404).json({ error: 'Plantilla no encontrada' });
        }
        return answer.success(req, res, template, 200);
        //res.json(template.toJSON());
    } catch (error) {
        return answer.error(req, res, "Error when obtaining the template", 500);
        //res.status(500).json({ error: 'Error al obtener la plantilla', details: error });
    }
}

async function createTemplate(req, res) {
    const body = req.body;
    const username = body.username;
    const canvas_json = body.canvas_json;

    if (!username || !canvas_json) {
        return answer.error(req, res, "Missing mandatory fields", 400);
        //return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const user = await userService.getUserByName(username);
    if (!user) {
        return answer.error(req, res, "User not found", 404);
        //return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    try {
        const saved = await templateService.createTemplate(body, user.id);
        return answer.success(req, res, saved, 201);
        //res.status(201).json(saved.toJSON());
    } catch (error) {
        return answer.error(req, res, "Error when creating the template", 500);
        //res.status(500).json({ error: 'Error al crear la plantilla', details: error });
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
            //return res.status(404).json({ error: 'Plantilla no encontrada' });
        }
        const result = await templateService.updateTemplate(body, id, userId);
        return answer.success(req, res, result, 200);

        //res.json(result.toJSON());
    } catch (error) {
        return answer.error(req, res, "Error when updating the template", 500);
        //res.status(500).json({ error: 'Error al actualizar plantilla', details: error });
    }
}

async function deleteTemplate(req, res) {
    const id = req.params.id;
    const userId = req.params.userId;

    try {
        const success = await templateService.deleteTemplate(id, userId);
        if (!success) {
            return answer.error(req, res, "Template not found", 404);
            //return res.status(404).json({ error: 'Plantilla no encontrada o no autorizada' });
        }
        return answer.success(req, res, success, 200);
        //res.json({ success: true });
    } catch (error) {
        return answer.error(req, res, "Error when deleting the template", 500);
        //res.status(500).json({ error: 'Error al eliminar plantilla', details: error });
    }
}

module.exports = router;
