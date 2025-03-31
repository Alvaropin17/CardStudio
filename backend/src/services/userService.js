const UserRepository = require('../database/userRepository');
const User = require('../database/models/user');


function all() {
    return UserRepository.getAll();
}

function one(id) {
    return UserRepository.getOne(id);
}

function createUser(body) {
    const newUser = new User(null, body.name, body.password);
    return UserRepository.createUser(newUser);
}

function updateUser(id, body) {
    const updatedUser = new User(id, body.name, body.password);
    return UserRepository.updateUser(updatedUser);
}

function deleteUser(id) {
    return UserRepository.deleteUser(id);
}

module.exports = {
    all,
    one,
    createUser,
    updateUser,
    deleteUser
};
