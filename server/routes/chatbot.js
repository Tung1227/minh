const router = require("express").Router();
const prisma = require('../utils/db')


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
