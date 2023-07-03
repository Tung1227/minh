const router = require("express").Router();
const prisma = require('../utils/db')
const authorization = require('../middleware/authorization')
const sendEmail = require("../utils/email");


router.get("/listpost", authorization, async (req, res) => {
    console.log("a")
    const inacceptPost = await prisma.post.findMany({
        where: {
            status: 'posted'
        },
        orderBy: {
            create_on: 'asc'
        }
    })
    return res.json({ inacceptPost })

});

router.get("/listreport", authorization, async (req, res) => {
    const inacceptReport = await prisma.report.findMany({
        where: {
            status: 'created',
            post: {
                status: 'accepted'
            }
        },
        select: {
            report_id: true,
            content: true,
            create_on: true,
            post: {
                select: {
                    title: true,
                    post_id: true
                }
            }
        }
    })
    return res.json({ inacceptReport })
});

router.get("/updatedpost", authorization, async (req, res) => {
    console.log("a")
    const inacceptPost = await prisma.post.findMany({
        where: {
            status: 'updated'
        },
        orderBy: {
            create_on: 'asc'
        }
    })
    return res.json({ inacceptPost })

});


router.post("/detailreport", authorization, async (req, res) => {
    const { report_id } = req.body
    const reports = await prisma.report.findFirst({
        where: {
            report_id: report_id,
        }
    })


    return res.send({ reports });
})

router.post("/acceptreport", authorization, async (req, res) => {

    const { report_id } = req.body
    console.log("accept report", report_id)
    const report = await prisma.report.update({
        where: {
            report_id: report_id,
        },
        data: {
            status: 'accepted'
        }
    })

    const post = await prisma.post.update({
        where: {
            post_id: report.post_id,
        },
        data: {
            status: 'removed'
        }
    })

    const user = await prisma.account.findFirst({
        where: {
            post: {
                some: {
                    post_id: post.post_id,
                }
            }
        }
    })

    const message = await `Tin đã đăng của bạn đã bị xoá.`;
    sendEmail(user.user_email, "Tin đăng bị xoá", message);
    return res.status(202).send({ "message": "cập nhật thành công" });
})

router.post("/rejectreport", authorization, async (req, res) => {
    const { report_id } = req.body
    console.log("reject report", report_id)
    const report = await prisma.report.update({
        where: {
            report_id: report_id,
        },
        data: {
            status: 'reject'
        }
    })

    return res.status(202).send({ "message": "Cập nhật thành công" });
})

router.post("/acceptpost", authorization, async (req, res) => {
    console.log(req.body, "accept post")
    const { post_id } = req.body
    const post = await prisma.post.update({
        where: {
            post_id: post_id,
        },
        data: {
            status: 'accepted',
        }
    })
    const user = await prisma.account.findFirst({
        where: {
            user_id: post.user_id,
        }
    })
    const message = await `Tin đã đăng của bạn đã được duyệt.`;
    sendEmail(user.user_email, "Tin đăng được duyệt", message);
    return res.status(202).send({ "message": "cập nhật thành công" });
})

router.post("/rejectpost", authorization, async (req, res) => {
    const { post_id } = req.body
    const reports = await prisma.post.update({
        where: {
            post_id: post_id,
        },
        data: {
            status: '',
        }
    })
    const user = await prisma.account.findFirst({
        where: {
            user_id: post.user_id,
        }
    })
    const message = await `Tin đã đăng của bạn đã bị từ chối.`;
    sendEmail(user.user_email, "Tin đăng bị từ chối", message);
    return res.status(202).send({ "message": "cập nhật thành công" });
})

module.exports = router;