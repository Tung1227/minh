const router = require("express").Router();
const authorize = require("../middleware/authorization")
const pool = require("../db")

router.get("/dashboard", authorize, async (req, res) => {
    try {
        const user = await pool.query("SELECT * FROM USERS WHERE user_id = $1", [
            req.user
        ])
        
        res.json(user.rows[0])
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Server Error")
    }
})

module.exports = router;