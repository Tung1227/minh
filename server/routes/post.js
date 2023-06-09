const router = require("express").Router();
const authorize = require("../middleware/authorization")
const prisma = require('../utils/db')
const upload = require("../middleware/upload");

router.post("/createpost", authorize, async (req, res) => {
    try {
        await upload(req, res);
        console.log(req.files[0].filename);
        if (req.files.length <= 0) {
            return res.send(`You must select at least 1 file.`);
        }
        let img_file = "";
        req.files.forEach(img => { img_file += img.filename + ","; })
        const { file, title, content, city, district, ward, price, acreage, air_condition, washing, electric_price, water_price } = req.body
        console.log(req.body)
        const post = await prisma.post.create({
            data: {
                title: title,
                create_on: new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
                user_id: req.user
            }
        })

        const post_detail = await prisma.detail_post.create({
            data: {
                post_id: post.post_id,
                title: title,
                content: content,
                city: city,
                district: district,
                ward: ward,
                image_file: img_file,
                price: price,
                acreage: acreage,
                air_condition: air_condition == '0' ? false : true,
                washing: washing == '0' ? false : true,
                electric_price: electric_price,
                water_price: water_price
            }
        })

        return res.send(`Post create sucessfully.`);
    } catch (error) {
        console.log(error);

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.send("Too many files to upload.");
        }
        return res.send(`Error when trying upload many files: ${error}`);
    }
});

router.get("/allpost", async (req, res) => {
    try {
        const post = await prisma.post.findMany({
            include: {
                detail_post: {
                    select: {
                        price: true,
                    },
                },
            }
        })


        return res.send({ post });
    } catch (error) {
        console.log(error);

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.send("Too many files to upload.");
        }
        return res.send(`Error when trying upload many files: ${error}`);
    }
});

router.post("/searchpost", async (req, res) => {
    try {
        const { city, district, ward, price, acreage, air_condition, washing, electric_price, water_price } = req.body
        const posts = await prisma.post.findMany({
            include: {
                detail_post: {
                    where: {
                        city: city,
                        district: district,
                        ward: ward,
                        price: price,
                        acreage: acreage,
                        air_condition: air_condition == '0' ? false : true,
                        washing: washing == '0' ? false : true,
                        electric_price: electric_price,
                        water_price: water_price
                    },
                },
            },

        })
        const result = posts.filter(post => post.detail_post.length != 0)

        return res.send({ result });
    } catch (error) {
        console.log(error);
    }
})

router.post("/chatpost", async (req, res) => {
    try {
        const { city, district, ward, price, acreage, air_condition, washing, electric_price, water_price } = req.body
        const posts = await prisma.post.findMany({
            include: {
                detail_post: {
                    where: {
                        city: city,
                        district: district,
                        ward: ward,
                        price: price,
                        acreage: acreage,
                        air_condition: air_condition == '0' ? false : true,
                        washing: washing == '0' ? false : true,
                        electric_price: electric_price,
                        water_price: water_price
                    },
                },
            },

        })
        const result = posts.filter(post => post.detail_post.length != 0)

        return res.send({ result });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;