class CsvDataSet {
    constructor(id, user_id, name, headers, data_rows) {
        this.id = id; 
        this.user_id = user_id; 
        this.name = name;
        this.headers = headers; 
        this.data_rows = data_rows; 
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
            name: this.name,
            headers: this.headers,
            data_rows: this.data_rows,
        };
    }
}

module.exports = CsvDataSet;
