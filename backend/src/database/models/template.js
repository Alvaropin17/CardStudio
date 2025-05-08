class Template {
    constructor(id, user_id, name, csv_id = null, canvas_json) {
        this.id = id;
        this.user_id = user_id;
        this.name = name;
        this.csv_id = csv_id; 
        this.canvas_json = canvas_json;
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
            name: this.name,
            csv_id: this.csv_id,
            canvas_json: this.canvas_json,
        };
    }
}

module.exports = Template;