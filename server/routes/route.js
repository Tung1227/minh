const router = require("express").Router();
const pool = require("../db")
const bcrypt = require("bcrypt")
const jwtGenerator = require("../utils/jwtGenerator")

//test db

router.post("/register", async (req, res) => {
    try {

        // 1. destructure the req.body(name, email, password)
        const { name, email, password } = req.body;

        // 2. check if user exist(if user exist then throw error)
        const user = await pool.query("SELECT * FROM USERS where user_email = $1", [email]);

        if (user.rows.length !== 0) {
            return res.status(401).send("User already exist!!!")
        }

        // 3. Bcrypt user password 

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound)
        const bcryptPassword = await bcrypt.hash(password, salt);

        // 4. enter new user into our database
        const newUser = await pool.query("INSERT INTO USERS (user_name, user_email, user_password) values ($1, $2, $3) RETURNING *", [
            name, email, bcryptPassword
        ])
        console.log(newUser.rows[0].user_id)

        // 5. generating out jwt token 
        const token = jwtGenerator(newUser.rows[0].user_id)
        console.log({ token })
        res.json({ token })
    } catch (error) {
    }
})

module.exports = router;