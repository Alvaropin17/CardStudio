const bcrypt = require('bcryptjs');
const userRepository = require('../../database/userRepository');
const jwt = require('./jsonwebtoken');

async function login(username, password) {
    const user = await userRepository.getByName(username);

    if (!user) {
        throw { status: 401, message: 'Usuario no encontrado' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw { status: 401, message: 'Contraseña incorrecta' };
    }

    const payload = {
        id: user.id,
        name: user.name
    };

    const token = jwt.signToken(payload);

    return { token };
}



module.exports = {
    login
};
