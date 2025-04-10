const Express = require('express');

const answer = require('../../red/answers');
const loginService = require('./authService');
const User = require('../../database/models/user');


const router = Express.Router();

router.get('/login', login);

async function login(req, res, next) {
    try {
        const token = await loginService.login(req.body.user, req.body.password);
        answer.success(req, res, token, 200);
    } catch (error) {
        console.error("Error:", error); 
        return answer.error(req, res, "Error en el servidor", 500);
    }
}

module.exports = router;