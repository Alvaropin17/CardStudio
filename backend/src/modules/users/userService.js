const userRepository = require('../../database/userRepository');
const User = require('../../database/models/user');


function all() {
    return userRepository.getAll();
}

function one(id) {
    return userRepository.getOne(id);
}

function createUser(body) {
    const newUser = new User(null, body.user, body.password, body.email);
    return userRepository.createUser(newUser);
}

function updateUser(id, body) {
    const updatedUser = new User(id, body.name, body.password, body.email);
    return userRepository.updateUser(updatedUser);
}

function deleteUser(id) {
    return userRepository.deleteUser(id);
}

module.exports = {
    all,
    one,
    createUser,
    updateUser,
    deleteUser
};
