const bcrypt = require('bcryptjs');
const userRepository = require('../../database/userRepository');
const jwt = require('./jsonwebtoken');
const answer = require('../../red/answers');
const User = require('../../database/models/user');

async function login(username, password) {

    console.log('username', username);
    console.log('password', password);

    const userData = await userRepository.getByName(username);

    if (!userData) {
        throw { status: 401, message: 'Usuario no encontrado' };
    }

    const user = new User(userData.id, userData.name, userData.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw { status: 401, message: 'Contraseña incorrecta' };
    }

    const payload = {
        id: user.id,
        name: user.name
    };

    const token = jwt.signToken(payload);

    return {
        token,
        user: user.toJSON()
    };
}


function verifyToken(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: true, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verifyToken(token); 
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).json({ error: true, message: 'Invalid or expired token' });
    }
}

function checkUserPermission(req, res, next) {
    const userIdFromToken = req.user?.id;
    const userIdFromParams = parseInt(req.params.id);

    if (userIdFromToken !== userIdFromParams) {
        return answer.error(req, res, 'No tienes permisos para esta acción', 403);
    }

    next();
}


module.exports = {
    login,
    verifyToken,
    checkUserPermission
};
