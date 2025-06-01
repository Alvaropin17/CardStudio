const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");


mongoose.connect('mongodb://127.0.0.1:27017/appdatabase')
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
    

let gfs;
const conn = mongoose.connection;
conn.once("open", () => {
  gfs = new GridFSBucket(conn.db, { bucketName: "card_images" });
});


function getGridFS() {
    if (!gfs) {
        throw new Error("GridFS no está inicializado. Espera a que la conexión esté lista.");
    }
    return gfs;

}

module.exports = {
    getGridFS
};

