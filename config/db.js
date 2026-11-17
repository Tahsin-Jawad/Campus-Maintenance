const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.TIDB_HOST,
    port: Number(process.env.TIDB_PORT),
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: {
        minVersion: "TLSv1.2"
    }
});

db.connect((err) => {
    if (err) {
        console.log("TiDB connection failed:", err.message);
        return;
    }

    console.log("TiDB Cloud Connected Successfully!");
});

module.exports = db;