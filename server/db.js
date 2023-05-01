const Pool = require("pg").Pool

const pool = new Pool({
    user: "user",
    password: "admin",
    host: "local_pgdb",
    port: 5432,
    database: "webnhatro"
})

module.exports = pool;