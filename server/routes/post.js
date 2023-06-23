const router = require("express").Router();
const authorize = require("../middleware/authorization")
const prisma = require('../utils/db')
const upload = require("../middleware/upload");
const sendEmail = require("../utils/email");


router.post("/createpost", [authorize, upload], async (req, res) => {
    try {
        // await upload(req, res);
        console.log("a        ---" + req.files);
        console.log("b        ---", req.body);
        if (req.files.length <= 0) {
            return res.send({ "error": "Bạn phải chọn 1 file" });
        }
        let img_file = "";
        req.files.forEach(img => { img_file += img.filename + ","; })
        const { file, title, content, city, district, ward, price, acreage, address, electric_price, water_price, air_condition, washing } = req.body
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
                air_condition: air_condition == 'true' ? true : false,
                washing: washing == 'true' ? true : false,
                electric_price: electric_price,
                water_price: water_price,
                address: address
            }
        })
        console.log('p', post_detail);
        const user = await prisma.account.findFirst({
            where: {
                user_id: req.user
            },
            select: {
                user_email: true
            }
        })
        const message = await `Tin đăng của bạn được tạo thành công. Vui lòng chờ để được hiển thị`;
        console.log(user)
        sendEmail(user.user_email, "Đăng tin thành công", message);
        return res.send({ "message": "Tạo tin thành công" });
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
        const posts = await prisma.post.findMany({
            select: {
                detail_post: {
                    select: {
                        price: true,
                        image_file: true
                    },
                },
                post_id: true,
                title: true
            },
            where: {
                status: 'posted'
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

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.send("Too many files to upload.");
        }
        return res.send(`Error when trying upload many files: ${error}`);
    }
});

router.post("/searchpost", async (req, res) => {
    try {
        let { city, district, ward, price, air_condition, washing, electric_price, water_price } = req.body
        let posts
        console.log(req.body)
        if (price == '') {
            price = 0
            console.log(price)
        }
        if (electric_price == '') {
            electric_price = 0
            console.log(electric_price)
        }
        if (water_price == '') {
            water_price = 0
            console.log(water_price)

        }
        if (ward) {
            console.log('w', ward)
            posts = await prisma.$queryRaw`SELECT P.TITLE,
                P.POST_ID,
                D.DISTRICT,
                d.price,
                d.image_file,
                ABS(d.price::int-${price}::int) as diffPrice,
                ABS(d.electric_price::int-${electric_price}::int) as diffElect,
                ABS(d.water_price::int-${water_price}::int) as diffwater
                FROM POST P
                INNER JOIN DETAIL_POST D ON P.POST_ID = D.POST_ID where
                ward = ${ward}::text
                and air_condition = ${air_condition}::boolean
	            and washing = ${washing}::boolean
                order by diffPrice asc ,diffElect asc,diffwater asc `
        }
        else if (district) {
            console.log('d', district)
            posts = await prisma.$queryRaw`SELECT P.TITLE,
                P.POST_ID,
                D.DISTRICT,
                d.price,
                d.image_file,
                ABS(d.price::int-${price}::int) as diffPrice,
                ABS(d.electric_price::int-${electric_price}::int) as diffElect,
                ABS(d.water_price::int-${water_price}::int) as diffwater
                FROM POST P
                INNER JOIN DETAIL_POST D ON P.POST_ID = D.POST_ID where
                district = ${district}::text
                and air_condition = ${air_condition}::boolean
	            and washing = ${washing}::boolean
                order by diffPrice asc ,diffElect asc,diffwater asc `
        } else if (city) {
            console.log('c', city)
            posts = await prisma.$queryRaw`SELECT P.TITLE,
                P.POST_ID,
                D.DISTRICT,
                d.price,
                d.image_file,
                ABS(d.price::int-${price}::int) as diffPrice,
                ABS(d.electric_price::int-${electric_price}::int) as diffElect,
                ABS(d.water_price::int-${water_price}::int) as diffwater
                FROM POST P
                INNER JOIN DETAIL_POST D ON P.POST_ID = D.POST_ID where
                city = ${city}::text
                and air_condition = ${air_condition}::boolean
	            and washing = ${washing}::boolean
                order by diffPrice asc ,diffElect asc,diffwater asc `}


        posts.forEach(post => {
            const img = post.image_file.split(',')
            post.image_file = img
        })


        return res.send({ posts });
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
router.post("/postdetail", async (req, res) => {
    const { post_id } = req.body
    console.log('a-----', req.body)
    const post = await prisma.post.findFirst({
        include: {
            detail_post: true
        },
        where: {
            post_id: post_id,
        }
    })

    const img = post.detail_post[0].image_file.split(',')
    const arr_image = img.filter(i => i.length != 0)
    post.detail_post[0].image_file = arr_image

    const address = await prisma.provinces.findFirst({
        where: {
            code: post.detail_post[0].city
        },
        select: {
            name: true,
            districts: {
                where: {
                    code: post.detail_post[0].district
                },
                select: {
                    name: true,
                    wards: {
                        select: {
                            name: true,
                        },
                        where: {
                            code: post.detail_post[0].ward
                        }
                    }
                }
            }
        }
    })
    const user = await prisma.account.findFirst({
        select: {
            user_name: true,
            userinfo: true
        },
        where: {
            user_id: post.user_id,
        }
    })

    return res.send({ post, user, address });
})

router.post("/report", authorize, async (req, res) => {
    try {
        const { content, post_id } = req.body
        console.log('a-----', content, post_id)
        console.log('b-----', req.user)

        // const post = await prisma.post.findFirst({
        //     where: {
        //         post_id: post_id
        //     }
        // })

        // const accout = await prisma.account.findFirst({
        //     where: {
        //         user_id: req.user
        //     }
        // })

        const report = await prisma.report.create({
            data: {
                content: content,
                post_id: post_id,
                create_on: new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
                user_id: req.user,
                status: "created"
            }
        })

        console.log(report)
        res.status(200).send(report)
    } catch (error) {
        console.log(error.message)
    }
})

module.exports = router;