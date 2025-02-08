const db = require('../../database/users')

const TABLE = 'users';

function all(){
    return db.all(TABLE);
}


module.exports = {
    all,
}