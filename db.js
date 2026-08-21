const { Pool } = require("pg");


const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "intern_assessment",
    password: "kalgres12",
    port: 5432
});


module.exports = pool;