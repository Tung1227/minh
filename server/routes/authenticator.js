const router = require("express").Router();
const pool = require("../db")
const bcrypt = require("bcryptjs")
const jwtGenerator = require("../utils/jwtGenerator")
const validInfo = require("../middleware/validInfo")
const authorization = require("../middleware/authorization")
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

//test db

router.post("/register", validInfo, async (req, res) => {
    try {

        // 1. destructure the req.body(name, email, password)
        const { name, email, password } = req.body;

        // 2. check if user exist(if user exist then throw error)
        const user = await prisma.users.findFirst({
            where: {
                user_email: email
            }
        })
        // console.log(user)

        if (user !== null) {
            return res.status(401).send({"message": "User already exist!!!"})
        }

        // 3. Bcrypt user password 


        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound)
        const bcryptPassword = await bcrypt.hash(password, salt);

        // 4. enter new user into our database
        // const newUser = await pool.query("INSERT INTO USERS (user_name, user_email, user_password) values ($1, $2, $3) RETURNING *", [
        //     name, email, bcryptPassword
        // ])
        // 5. generating out jwt token 
        let token;
        async function main() {
            const newUser = await prisma.users.create({
                data: {
                    user_name: name,
                    user_email: email,
                    user_password: bcryptPassword
                },
            })
            console.log(newUser)
            token = jwtGenerator(newUser.user_id)
            console.log(1)
            return token;
        }
        main()
            .then(async (token) => {
                await prisma.$disconnect()
                console.log(token)
                res.json({ token })
            })
            .catch(async (e) => {
                console.error(e)
                await prisma.$disconnect()
                process.exit(1)
            })

        // 5. generating out jwt token 
        console.log("a " + 2)
    } catch (error) {
        console.log(error)
        res.status(500).send({"message":"Server Error"})
    }
});

// login route

router.post("/login", validInfo, async (req, res) => {
    try {

        // . destructure req.body
        const { email, password } = req.body

        // 2. check if user doesn't exist (if not exist throw error)
        const user = await prisma.users.findFirst({
            where: {
                user_email: email
            }
        })
        if (user === null) {
            return res.status(401).json({"message":"Email or Password is incorrect"})
        }
        // 3. check if incoming password is the same the database password 
        const validPassword = await bcrypt.compare(password, user.user_password)
        if (!validPassword) {
            res.status(401).send({"message":"Email or Password is incorrect"})
        }

        // 4. given them jwt token 

        const token = jwtGenerator(user.user_id)
        res.json({ token })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({"message":"Server Error"})
    }
})

// private route

router.get("/is-verify", authorization, async (req, res) => {
    try {
        res.json(true)
    } catch (error) {
        console.log(error.message)
        res.status(500).send({"message":"Server Error"})
    }
})

module.exports = router;