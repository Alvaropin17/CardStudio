class CsvDataSet {
    constructor(id, user_id, name, headers, data) {
        this.id = id; 
        this.user_id = user_id;
        this.name = name; 
        this.headers = headers; 
        this.data = data; 
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
            name: this.name,
            headers: this.headers,
            data: this.data,
        };
    }
}

module.exports = CsvDataSet;
