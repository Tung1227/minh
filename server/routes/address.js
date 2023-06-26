const router = require("express").Router();
const prisma = require('../utils/db')

router.get("/city", async (req, res) => {
    const city = await prisma.provinces.findMany({
        select: {
            code: true,
            name: true
        },
        orderBy: {
            name: 'asc',
        }

    })
    return res.json(city)
});

router.post("/district", async (req, res) => {
    const { code } = req.body
    const districts = await prisma.provinces.findMany({
        where: {
            code: code
        },
        select: {
            districts: {
                select: {
                    code: true,
                    name: true
                },
                orderBy: {
                    name: 'asc',
                }
            }
        }
    })
    return res.json(districts)
});

router.post("/ward", async (req, res) => {
    const wards = await prisma.districts.findMany({
        where: {
            code: req.body.code
        },
        select: {
            wards: {
                select: {
                    code: true,
                    name: true
                },
                orderBy: {
                    name: 'asc',
                }
            }
        }
    })
    return res.json(wards)
});

module.exports = router;