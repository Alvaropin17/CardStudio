const jwt = require('jsonwebtoken');
const config = require('../../config');

function signToken(payload) {
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: '2h'
    });
}

function verifyToken(token) {
    return jwt.verify(token, config.jwt.secret);
}

module.exports = {
    signToken,
    verifyToken
};
