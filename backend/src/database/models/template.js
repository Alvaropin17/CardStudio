class Template {
    constructor(id, user_id, name, canvas_json) {
        this.id = id;
        this.user_id = user_id;
        this.name = name;
        this.canvas_json = canvas_json; // Canvas JSON 
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
            name: this.name,
            canvas_json: this.canvas_json,
        };
    }
}

module.exports = Template;
