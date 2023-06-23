const router = require("express").Router();
const prisma = require('../utils/db')


router.post("/searchpost", async (req, res) => {
    try {
        let { price, air_condition, washing, electric_price, water_price, location } = req.body
        console.log(req.body)
        let posts = []
        if (price == 'undefined') {
            price = 0
            console.log(price)
        }
        if (electric_price == 'undefined') {
            electric_price = 0
            console.log(electric_price)
        }
        if (water_price == 'undefined') {
            water_price = 0
            console.log(water_price)
        }
        const codesWard = await prisma.wards.findFirst({
            select: {
                code: true
            },
            where: {
                OR: [{
                    name: location
                }, {
                    name_en: location
                }
                ]
            }
        })
        const codesDistrict = await prisma.districts.findFirst({
            select: {
                code: true
            },
            where: {
                OR: [{
                    name: location
                }, {
                    name_en: location
                }
                ]
            }
        })
        const codesCity = await prisma.provinces.findFirst({
            select: {
                code: true
            },
            where: {
                OR: [{
                    name: location
                }, {
                    name_en: location
                }
                ]
            }
        })
        let codes = []
        // parseRes.splice(0, 0, { code: '', name: 'Toàn quốc' });
        console.log(codesWard, codesDistrict, codesCity)
        if (codesCity != null) {
            codes = codes.splice(0, 0, codesCity.code)

        }
        if (codesDistrict != null) {
            codes.splice(0, 0, codesDistrict.code)

        }
        if (codesWard != null) {
            codes.splice(0, 0, codesWard.code)
        }
        if (codes.length == 0) {
            const post = await prisma.$queryRaw`SELECT P.TITLE,
                            P.POST_ID,
                            D.DISTRICT,
                            d.price,
                            d.image_file,
                            ABS(d.price::int-${price}::int) as diffPrice,
                            ABS(d.electric_price::int-${electric_price}::int) as diffElect,
                            ABS(d.water_price::int-${water_price}::int) as diffWater
                            FROM POST P
                            INNER JOIN DETAIL_POST D ON P.POST_ID = D.POST_ID WHERE
                            air_condition = ${air_condition}::boolean
                            and washing = ${washing}::boolean
                            order by diffPrice asc ,diffElect asc,diffWater asc `
            if (post.length > 0) {
                for (let i = 0; i < post.length; i++) {
                    posts.push(post[i])
                }
            }
        }
        else {
            for (let j = 0; j < codes.length; j++) {

                const post = await prisma.$queryRaw`SELECT P.TITLE,
                            P.POST_ID,
                            D.DISTRICT,
                            d.price,
                            d.image_file,
                            ABS(d.price::int-${price}::int) as diffPrice,
                            ABS(d.electric_price::int-${electric_price}::int) as diffElect,
                            ABS(d.water_price::int-${water_price}::int) as diffWater
                            FROM POST P
                            INNER JOIN DETAIL_POST D ON P.POST_ID = D.POST_ID WHERE
                            city = ${codes[j]}::text
                            or district = ${codes[j]}::text
                            or ward = ${codes[j]}::text 
                            and air_condition = ${air_condition}::boolean
                            and washing = ${washing}::boolean
                            order by diffPrice asc ,diffElect asc,diffWater asc `
                if (post.length > 0) {
                    for (let i = 0; i < post.length; i++) {
                        posts.push(post[i])
                    }
                }
            }
        }

        posts.forEach(post => {
            const img = post.image_file.split(',')
            post.image_file = img
        })
        return res.send({ posts });
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;