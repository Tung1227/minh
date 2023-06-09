const router = require("express").Router();
const authorize = require("../middleware/authorization")
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

router.get("/", authorize, async (req, res) => {
    try {
        const user = await prisma.account.findFirst({
            where:{
                user_id: req.user
            }
        })
        console.log(user)
        res.json(user)
    } catch (error) {
        console.log(error.message)
        res.status(500).send({"message":"Server Error"})
    }
})

module.exports = router;