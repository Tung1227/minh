const router = require("express").Router();
const authorize = require("../middleware/authorization")
const pool = require("../db")
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

router.get("/", authorize, async (req, res) => {
    try {
        const user = await prisma.users.findFirst({
            where:{
                user_id: req.user
            }
        })
        
        res.json(user)
    } catch (error) {
        console.log(error.message)
        res.status(500).send({"message":"Server Error"})
    }
})

module.exports = router;