const bcrypt = require('bcryptjs');
const userRepository = require('../../database/userRepository');
const jwt = require('./jsonwebtoken');
const answer = require('../../red/answers');
const User = require('../../database/models/user');

//------------------------------------------Login Functions----------------------------------------//

async function login(body) {

    const username = body.user;
    const password = body.password;

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

    const tokenCookie = req.cookies.token;

    if (!tokenCookie) {
        return res.status(401).json({ error: true, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verifyToken(tokenCookie);
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

//------------------------------------------Register Functions----------------------------------------//
async function register(body) {

    console.log('body', body);
    const username = body.user;
    const password = body.password;
    const email = body.email;

    console.log('username', username);
    console.log('password', password);
    console.log('email', email);  

    if (!username || !password || !email) {
        throw { status: 400, message: 'Faltan campos obligatorios' };
    }

    if (password.length < 8) {
        throw { status: 400, message: 'La contraseña debe tener al menos 8 caracteres' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw { status: 400, message: 'El email no tiene un formato válido' };
    }

    const existingUser = await userRepository.getByName(username);
    if (existingUser) {
        throw { status: 409, message: 'El nombre de usuario ya existe' };
    }

    const newUser = new User(null, username, password, email);
    const createdUser = await userRepository.createUser(newUser);

    return {
        user: createdUser.toJSON()
    };
}

module.exports = {
    login,
    verifyToken,
    checkUserPermission,
    register
};
