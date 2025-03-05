const db = require('../../database/userRepository')

const TABLE = 'users';

function all(){
    return db.all(TABLE);
}

function one(id){
    return db.one(TABLE, id);
}


module.exports = {
    all,
    one
}