const userRepository = require('./userRepository');
const User = require('../../database/models/user');


function all() {
    return userRepository.getAll();
}

function getUserById(id) {
    return userRepository.getOne(id);
}

function createUser(body) {
    const newUser = new User(null, body.user, body.password, body.email);
    return userRepository.createUser(newUser);
}

async function updateUser(id, body) {
    const existingUser =  await userRepository.getOne(id);
    if(body.password){
        const updatedUser = new User(id, existingUser.name, body.password,existingUser.email);
        await userRepository.updateUserPassword(updatedUser);
    }
    if (body.name){
        const updatedUser = new User(id, body.name, existingUser.password, existingUser.email);
        await userRepository.updateUserName(updatedUser);
    }
    if (body.email) {
        const updatedUser = new User(id, existingUser.name, existingUser.password, body.email);
        await userRepository.updateUserEmail(updatedUser);
    }
    return userRepository.getOne(id);;
}

function deleteUser(id) {
    return userRepository.deleteUser(id);
}

function getUserByName(name) {
    return userRepository.getByName(name);
}   

module.exports = {
    all,
    getUserById,
    getUserByName,
    createUser,
    updateUser,
    deleteUser
};
