const bcrypt = require("bcryptjs");

class User {
    constructor(id, name, password) {
        this.id = id;
        this.name = name;
        this.password = password;
    }

    async setPassword(plainPassword) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(plainPassword, salt);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
        };
    }
}

module.exports = User;
