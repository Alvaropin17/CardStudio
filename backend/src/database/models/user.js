const bcrypt = require("bcryptjs");

class User {
    constructor(id, name, password, email) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.email = email;
    }

    async setPassword(plainPassword) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(plainPassword, salt);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
        };
    }
}

module.exports = User;