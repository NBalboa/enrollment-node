const mysql = require("mysql");

class Database {
    constructor () {
        this.connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "balboa_1234!$#",
            database: "admission"
        })
    }

    TestConnection() {
        this.connection.connect((err) => {
            if(err) return err;
            console.log("Database Connected")
        })
    }
}

module.exports = Database