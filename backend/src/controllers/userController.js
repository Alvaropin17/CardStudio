const Express = require('express');

const Answer = require('../red/answers');
const UserService = require('../services/userService');
const User = require('../models/user');


const router = Express.Router();

router.get('/', all);
router.get('/:id', one);
router.post('/', saveUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);


async function all (req, res){
    let allUsers = await  UserService.all();
    Answer.success(req, res, allUsers, 200);
}

async function one(req, res) {
    try {
        let singleUser = await UserService.one(req.params.id);
        
        if (!singleUser) {
            return Answer.error(req, res, "Usuario no encontrado", 404); // 🔹 Si no existe, manda error y TERMINA
        }

        return Answer.success(req, res, singleUser, 200); // 🔹 Si existe, responde y TERMINA
    } catch (error) {
        console.error("Error en one:", error); // 🔹 Agrega logs para debug
        return Answer.error(req, res, "Error en el servidor", 500);
    }
}

async function saveUser(req, res) {
    const body = req.body;

    if (!body) {
        return Answer.error(req, res, "Datos inválidos", 400);
    }

    try {
        let result = await UserService.createUser(body);
        Answer.success(req, res, result, 200);
    } catch (error) {
        Answer.error(req, res, "Error en el servidor", 500);
    }
}

async function updateUser(req, res) {
    const body = req.body;
    const userId = req.params.id;

    if (!body || !userId) {
        return Answer.error(req, res, "Datos inválidos", 400);
    }

    try {
        let result = await UserService.updateUser(userId, body);
        Answer.success(req, res, result, 200);
    } catch (error) {
        Answer.error(req, res, "Error en el servidor", 500);
    }
}


async function deleteUser(req, res) {
    try {
        let deletedUser = await UserService.deleteUser(req.params.id);
        
        if (!deletedUser) {
            return Answer.error(req, res, "Usuario no encontrado", 404); // 🔹 Si no existe, responde y termina
        }

        return Answer.success(req, res, "Usuario eliminado correctamente", 200); // 🔹 Si se elimina, responde y termina
    } catch (error) {
        console.error("Error al eliminar usuario:", error); // 🔹 Log para depuración
        return Answer.error(req, res, "Error en el servidor", 500); // 🔹 Manejo de errores
    }
}

module.exports = router;