const bcrypt = require('bcryptjs');
const userService = require('../../modules/users/userService');
const jwt = require('./jsonwebtoken');
const answer = require('../../red/answers');
const User = require('../../database/models/user');

//------------------------------------------Login Functions----------------------------------------//

async function login(body) {

    const username = body.user;
    const password = body.password;

    const userData = await userService.getUserByName(username);

    if (!userData) {
        throw { status: 404, message: 'User not found' };
    }

    const user = new User(userData.id, userData.name, userData.password, userData.email);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw { status: 401, message: 'Invalid Password' };
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
    const userIdFromParams = parseInt(req.params.userId);

    if (userIdFromToken !== userIdFromParams) {
        return answer.error(req, res, 'Unauthorized', 401);
    }

    next();
}

//------------------------------------------Register Functions----------------------------------------//
async function register(body) {

    const username = body.user;
    const password = body.password;
    const email = body.email;

    if (!username || !password || !email) {
        throw { status: 400, message: 'Missing mandatory fields' };
    }

    if (password.length < 8) {
        throw { status: 400, message: 'Password too short' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw { status: 400, message: 'Invalid email format' };
    }

    const existingUser = await userService.getUserByName(username);
    if (existingUser) {
        throw { status: 409, message: 'Username already exists' };
    }

    const newUser = new User(null, username, password, email);
    const createdUser = await userService.createUser(newUser);

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
