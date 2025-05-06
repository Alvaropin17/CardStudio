const Express = require('express');

const { verifyToken, checkUserPermission } = require('../auth/authService');

const answer = require('../../red/answers');
const userService = require('../users/userService');


const router = Express.Router();

router.use('/:userId/templates', require('../templates/templateController'));
router.use('/:userId/csv-datasets', require('../csv/csvController'));

router.get('/', getAllUsers);
router.get('/:userId', getUserById);  
router.post('/', createUser);
router.put('/:userId', verifyToken, checkUserPermission, updateUser);
router.delete('/:userId', verifyToken, checkUserPermission, deleteUser);


async function getAllUsers (req, res){
    let allUsers = await  userService.all();
    answer.success(req, res, allUsers, 200);
}

async function getUserById(req, res) {
    try {
        let singleUser = await userService.getUserById(req.params.userId);
        
        if (!singleUser) {
            return answer.error(req, res, "Usuario no encontrado", 404);
        }

        return answer.success(req, res, singleUser, 200);
    } catch (error) {
        console.error("Error:", error);
        return answer.error(req, res, "Error en el servidor", 500);
    }
}

async function createUser(req, res) {
    const body = req.body;

    if (!body) {
        return answer.error(req, res, "Datos inválidos", 400);
    }

    try {
        let newUser = await userService.createUser(body);
        answer.success(req, res, newUser, 200);
    } catch (error) {
        answer.error(req, res, "Error en el servidor", 500);
    }
}

async function updateUser(req, res) {

    const body = req.body;
    const userId = req.params.userId;

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
        let deletedUser = await userService.deleteUser(req.params.userId);
        
        if (!deletedUser) {
            return answer.error(req, res, "Usuario no encontrado", 404);
        }

        return answer.success(req, res, "Usuario eliminado correctamente", 200);
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        return answer.error(req, res, "Error en el servidor", 500);
    }
}

module.exports = router;