const Express = require('express');

const answer = require('../../red/answers');
const authService = require('./authService');
const User = require('../../database/models/user');


const router = Express.Router();

router.post('/login', login);
router.post('/register', register);

async function login(req, res, next) {
    const body = req.body;

    if (!body) {
        return answer.error(req, res, "Datos inválidos", 400);
    }

    try {
        
        const loginAnswer = await authService.login(body);

        res.cookie('token', loginAnswer.token, {
            httpOnly: true,
        });

        answer.success(req, res, loginAnswer.user, 200);
    } catch (error) {
        console.error("Error:", error); 
        return answer.error(req, res, "Error en el servidor", 500);
    }
}

async function register(req, res) {
    const body = req.body;

    if (!body) {
        return answer.error(req, res, "Datos inválidos", 400);
    }

    try {
        
        const registerAnswer = await authService.register(body);
        answer.success(req, res, registerAnswer.user, 201);
    } catch (error) {
        console.error("Error:", error); 
        return answer.error(req, res, "Error en el servidor", 500);
    }
    
}

module.exports = router;