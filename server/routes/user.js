const router = require("express").Router();
const bcrypt = require("bcryptjs")
const authorization = require("../middleware/authorization")
const prisma = require('../utils/db')

router.get("", authorization, async (req, res) => {
    const user = await prisma.account.findFirst({
        where: {
            user_id: req.user
        },
        select: {
            userinfo: {
                select: {
                    avatar_img: true
                }
            },
            user_name: true
        }
    })
    return res.json(user)
});

module.exports = router;