const router = require("express").Router();
const bcrypt = require("bcryptjs")
const authorization = require("../middleware/authorization")
const prisma = require('../utils/db')
const authorize = require("../middleware/authorization")
const upload = require("../middleware/upload");
const sendEmail = require("../utils/email");




router.get("/info", authorization, async (req, res) => {
    const user = await prisma.account.findFirst({
        where: {
            user_id: req.user
        },
        select: {
            userinfo: {
                select: {
                    avatar_img: true,
                    phone_number: true,
                    city: true,
                    district: true,
                    ward: true,
                    street_address: true
                }
            },
            user_name: true
        }
    })
    return res.json(user)
});

router.get("/allpost", authorization, async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: {
                user_id: req.user,
                status: 'accepted'
            },
            select: {
                detail_post: {
                    select: {
                        image_file: true,
                        price: true,
                    }
                },
                title: true,
                post_id: true
            }
        })
        const result = posts.filter(post => post.detail_post.length != 0)
        result.forEach(post => {
            const img = post.detail_post[0].image_file.split(',')
            post.detail_post[0].image_file = img
        })
        return res.send({ result });
    } catch (error) {
        console.log(error);
    }
});

router.post("/updateinfo", [authorize, upload], async (req, res) => {
    try {
        // await upload(req, res);
        console.log("a        ---" + req.files);
        console.log("b        ---", req.body);
        let img_file = "";
        if (req.files.length <= 0) {
            img_file = 'Sample_User_Icon.png'
        }
        else {
            req.files.forEach(img => { img_file += img.filename })
        }
        const { userName, phoneNumber, city, district, ward, address } = req.body
        await prisma.account.update({
            where: {
                user_id: req.user
            },
            data: {
                user_name: userName
            }
        })

        const user = await prisma.account.findFirst({
            where: {
                user_id: req.user
            },
            select: {
                userinfo: {
                    select: {
                        info_id: true
                    }
                }
            }
        })
        console.log(user)
        const userinfo = await prisma.userinfo.update({
            data: {
                avatar_img: img_file,
                phone_number: phoneNumber,
                city: city,
                district: district,
                ward: ward,
                street_address: address
            },
            where: {
                info_id: user.userinfo[0].info_id,
            }
        })
        console.log('p', userinfo);
        return res.send({ "message": "Cập nhật thông tin thành công" });
    } catch (error) {
        console.log(error);
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.send("Too many files to upload.");
        }
        return res.send(`Error when trying upload many files: ${error}`);
    }
});

router.post("/updatepost", authorization, async (req, res) => {
    try {
        const { title, price, water, elect, content, city, district, ward, address, air_condition, washing, post_id } = req.body

        console.log(req.body)
        const posts = await prisma.post.update({
            where: {
                post_id: post_id,
            },
            data: {
                title: title,
                status: 'updated'
            }
        })

        const postDetail = prisma.detail_post.update({
            where: {
                post_id: post_id
            },
            data: {
                title: title,
                content: content,
                price: price,
                water_price: water,
                electric_price: elect,
                air_condition: air_condition,
                washing: washing,
                address: address,
                city: city,
                district: district,
                ward: ward
            }
        })

        const user = await prisma.account.findFirst({
            where: {
                user_id: req.user
            },
            select: {
                user_email: true
            }
        })
        const message = await `Tin đăng của bạn đã được cập nhật thành công. Vui lòng chờ phê duyệt để được hiển thị`;
        console.log(user)
        sendEmail(user.user_email, "Cập nhật thành công", message);
        return res.send({ "message": "Cập nhật thành công" });
    } catch (error) {
        console.log(error);
    }
});

router.post("/delete", authorization, async (req, res) => {
    try {
        const { post_id } = req.body

        console.log(req.body)

        const deltePost = await prisma.post.update({
            where: {
                post_id: post_id
            },
            data: {
                status: 'deleted'
            }
        })

        const user = await prisma.account.findFirst({
            where: {
                user_id: req.user
            },
            select: {
                user_email: true
            }
        })
        const message = await `Tin đăng của bạn đã được xoá thành công.`;
        console.log(user)
        sendEmail(user.user_email, "Xoá tin thành công", message);
        return res.send({ "message": "Cập nhật thành công" });
    } catch (error) {
        console.log(error);
    }
});





module.exports = router;