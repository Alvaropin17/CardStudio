const express = require('express');

const answer = require('../../red/answers');
const userService = require('./userService');

const router = express.Router();

router.get('/', all);
router.get('/:id', one);
router.post('/', saveUser);
router.put('/:id', deleteUser);


async function all (req, res){
    let allUsers = await  userService.all();
    answer.success(req, res, allUsers, 200);
}

async function one(req, res) {
    try {
        let singleUser = await userService.one(req.params.id);
        
        if (!singleUser) {
            return answer.error(req, res, "Usuario no encontrado", 404); // 🔹 Si no existe, manda error y TERMINA
        }

        return answer.success(req, res, singleUser, 200); // 🔹 Si existe, responde y TERMINA
    } catch (error) {
        console.error("Error en one:", error); // 🔹 Agrega logs para debug
        return answer.error(req, res, "Error en el servidor", 500);
    }
}

async function saveUser(req, res) {
    const body = req.body;

    if (!body) {
        return answer.error(req, res, "Datos inválidos", 400);
    }

    try {
        let result;
        if (body.id === 0 || !body.id) {
            // Si el ID es 0, se agrega un nuevo usuario
            result = await userService.createUser(body);
        } else {
            // Si el ID es distinto de 0, se actualiza un usuario existente
            result = await userService.updateUser(body);
        }
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