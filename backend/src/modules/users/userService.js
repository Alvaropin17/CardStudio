const userRepository = require('../../database/userRepository')

const TABLE = 'users';

function all(){
    return userRepository.all(TABLE);
}

function one(id){
    return userRepository.one(TABLE, id);
}

function createUser(body){
    return userRepository.createUser(TABLE, body);
}

function updateUser(body){
    return userRepository.updateUser(TABLE, body);
}

function deleteUser(id){
    return userRepository.deleteUser(TABLE, id);
}

module.exports = {
    all,
    one,
    createUser,
    updateUser,
    deleteUser
}