const router = require("express").Router();
const bcrypt = require("bcryptjs")
const jwtGenerator = require("../utils/jwtGenerator")
const validInfo = require("../middleware/validInfo")
const authorization = require("../middleware/authorization")
const prisma = require('../utils/db')
const sendEmail = require("../utils/email");

//test db

router.post("/register", validInfo, async (req, res) => {
    try {

        // 1. destructure the req.body(name, email, password)
        const { name, email, password } = req.body;
        console.log(![email, name, password].every(Boolean))
        // 2. check if user exist(if user exist then throw error)
        const user = await prisma.account.findFirst({
            where: {
                user_email: email
            }
        })
        // console.log(user)

        if (user !== null) {
            return res.status(401).send({ "message": "User already exist!!!" })
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
        const newUser = await prisma.account.create({
            data: {
                user_name: name,
                user_email: email,
                user_password: bcryptPassword
            },
        })
        console.log(newUser.user_id)
        token = await jwtGenerator(newUser.user_id)
        const updateAccount = await prisma.account.update({
            where: {
                user_id: newUser.user_id,
            },
            data: {
                jwt_token: token,
            },
        })
        const message = await `${process.env.BASE_URL}/verify?userId=${newUser.user_id}&token=${updateAccount.jwt_token}`;
        console.log(message)
        sendEmail(newUser.user_email, "Verify Email", message);
        res.send({ "message": "An Email sent to your account please verify" });
        // 5. generating out jwt token 
    } catch (error) {
        console.log(error)
        res.status(500).send({ "message": "Server Error" })
    }
});

// login route

router.post("/login", validInfo, async (req, res) => {
    try {
        // . destructure req.body
        const { email, password } = req.body

        // 2. check if user doesn't exist (if not exist throw error)
        const user = await prisma.account.findFirst({
            where: {
                user_email: email
            }
        })
        console.log(user)
        if (user === null) {
            return res.status(401).json({ "message": "Email or Password is incorrect" })
        }
        if (user.is_verify == false) {
            return res.status(401).json({ "message": "Please verify your email" })
        }
        // 3. check if incoming password is the same the database password 
        const validPassword = await bcrypt.compare(password, user.user_password)
        if (!validPassword) {
            return res.status(401).json({ "message": "Email or Password is incorrect" })
        }

        // 4. given them jwt token 

        const token = jwtGenerator(user.user_id)
        return res.json({ token })
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({ "message": "Server Error" })
    }
})

// private route

router.get("/is-verify", authorization, async (req, res) => {
    try {
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
                user_name: true,
                user_id: true,
                account_type: true
            }
        })
        return res.json(user)
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ "message": "Server Error" })
    }
})

router.post("/verify", async (req, res) => {
    try {
        const { user_id, jwt_token } = req.body
        const user = await prisma.account.findFirst({ where: { user_id: user_id } });
        if (!user) return res.status(400).send({ "message": "Invalid link" });
        if (user.jwt_token != jwt_token) return res.status(400).send({ "message": "Invalid link" });

        await prisma.account.update({
            where: { user_id: user.user_id },
            data: {
                is_verify: true
            }
        });

        await prisma.userinfo.create({
            data:{
                user_id: user.user_id,
                avatar_img: 'Sample_User_Icon.png'
            }
        })
        return res.status(202).send({ "message": "email verified sucessfully" });
    } catch (error) {
        console.log(error.message)
        return res.status(400).send({ "message": "An error occured" });
    }
});

router.post("/newpassword", async (req, res) => {
    try {
        const { user_id, password } = req.body
        console.log(user_id, password)
        const user = await prisma.account.findFirst({
            where: {
                user_id: user_id
            }
        })
        if (!user) {
            return res.status(403).json({ "message": "Người dùng không tồn tại" });
        } else {
            const validPassword = await bcrypt.compare(password, user.user_password)
            if (validPassword) {
                return res.status(409).json({ "message": "Không sử dùng lại mật khẩu cũ" }).end;
            } else {
                const saltRound = 10;
                const salt = await bcrypt.genSalt(saltRound)
                const bcryptPassword = await bcrypt.hash(password, salt);
                console.log(bcryptPassword)
                await prisma.account.update({
                    where: { user_id: user_id },
                    data: {
                        user_password: bcryptPassword
                    }
                });
                console.log(user)
                return res.status(202).json({ "message": "Đã đổi mật khẩu mới" });
            }
        }
    } catch (error) {
        console.log(error.message)
        return res.status(400).send({ "message": "Có lỗi xảy ra" });
    }
});

router.post("/changepassword", async (req, res) => {
    try {
        const { user_id, oldPassword, newPassword } = req.body
        const user = await prisma.account.findFirst({
            where: {
                user_id: user_id
            }
        })
        if (!user) {
            return res.status(403).json({ "message": "Người dùng không tồn tại" });
        } else {
            const validPassword = await bcrypt.compare(oldPassword, user.user_password)
            if (!validPassword) {
                return res.status(403).json({ "message": "Mật khẩu cũ không đúng" });
            }
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound)
            const bcryptPassword = await bcrypt.hash(newPassword, salt);
            console.log(bcryptPassword)
            await prisma.account.update({
                where: { user_id: user_id },
                data: {
                    user_password: bcryptPassword
                }
            });
            console.log(user)
            return res.status(202).json({ "message": "Đổi mật khẩu thành công" });
        }
    } catch (error) {
        console.log(error.message)
        return res.status(400).send({ "message": "Có lỗi xảy ra" });
    }
});

router.post("/getmail", async (req, res) => {
    try {
        const { mail } = req.body
        const user = await prisma.account.findFirst({
            where: {
                user_email: mail
            }
        })
        if (!user) {
            return res.status(403).json({ "message": "Email không tồn tại" });
        } else {
            const message = await `${process.env.BASE_URL}/newPass?userId=${user.user_id}`;
            sendEmail(user.user_email, "Mật khẩu mới", message);
            res.status(202).send({ "message": "Thư đổi mật khẩu đã được gửi đến bạn" });
        }
    } catch (error) {
        console.log(error.message)
        return res.status(400).send({ "message": "Có lỗi xảy ra" });
    }
})


module.exports = router;