const Express = require('express');

const answer = require('../../red/answers'); // Adjusted path to match the correct folder structure
const userService = require('../users/userService');
const User = require('../../database/models/user');


const router = Express.Router();

router.get('/', all);
router.get('/:id', one);
router.post('/', saveUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);


async function all (req, res){
    let allUsers = await  userService.all();
    answer.success(req, res, allUsers, 200);
}

async function one(req, res) {
    try {
        let singleUser = await userService.one(req.params.id);
        
        if (!singleUser) {
            return answer.error(req, res, "Usuario no encontrado", 404);
        }

        return answer.success(req, res, singleUser, 200);
    } catch (error) {
        console.error("Error en one:", error);
        return answer.error(req, res, "Error en el servidor", 500);
    }
}

async function saveUser(req, res) {
    const body = req.body;

    if (!body) {
        return answer.error(req, res, "Datos inválidos", 400);
    }

    try {
        let result = await userService.createUser(body);
        answer.success(req, res, result, 200);
    } catch (error) {
        answer.error(req, res, "Error en el servidor", 500);
    }
}

async function updateUser(req, res) {
    const body = req.body;
    const userId = req.params.id;

    if (!body || !userId) {
        return answer.error(req, res, "Datos inválidos", 400);
    }

    try {
        let result = await userService.updateUser(userId, body);
        answer.success(req, res, result, 200);
    } catch (error) {
        answer.error(req, res, "Error en el servidor", 500);
    }
}


async function deleteUser(req, res) {
    try {
        let deletedUser = await userService.deleteUser(req.params.id);
        
        if (!deletedUser) {
            return answer.error(req, res, "Usuario no encontrado", 404); // 🔹 Si no existe, responde y termina
        }

        return answer.success(req, res, "Usuario eliminado correctamente", 200); // 🔹 Si se elimina, responde y termina
    } catch (error) {
        console.error("Error al eliminar usuario:", error); // 🔹 Log para depuración
        return answer.error(req, res, "Error en el servidor", 500); // 🔹 Manejo de errores
    }
}

module.exports = router;