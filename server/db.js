const Pool = require("pg").Pool

const pool = new Pool({
    user: "user",
    password: "admin",
    host: "localhost",
    port: 54320,
    database: "WEBNHATRO"
})

module.exports = pool;