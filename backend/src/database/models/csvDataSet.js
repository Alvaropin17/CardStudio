class CsvDataSet {
    constructor(id, user_id, name, headers, data_rows) {
        this.id = id; // UUID o incremental, según tu base de datos
        this.user_id = user_id; // Usuario que subió el CSV
        this.name = name; // Nombre que el usuario le da al dataset
        this.headers = headers; // Array de strings con nombres de columnas
        this.data_rows = data_rows; // Array de objetos: cada objeto representa una fila del CSV
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
