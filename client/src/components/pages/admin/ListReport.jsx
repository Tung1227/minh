import { Fragment } from "react"
import { useState, useEffect } from "react";

export default function ListReport(props) {

    const [reports, setReports] = useState([]);
    const [report, setReport] = useState()


    const getAllReport = async () => {
        const url = await `${process.env.REACT_APP_API_URL}/admin/listreport`
        const respone = await fetch(url, {
            method: 'GET',
            headers: { token: localStorage.token }
        })

        const parseRes = await respone.json()
        setReports(parseRes.inacceptReport)
    }

    const getPost = async (post) => {
        try {
            console.log(post);
            const url = await `${process.env.REACT_APP_API_URL}/post/postdetail`
            const respone = await fetch(url, {
                method: 'POST',
                headers: { "content-Type": "application/json" },
                body: JSON.stringify({ post_id: post })
            })

            const parseRes = await respone.json()
            console.log(parseRes);
            props.setPostDetail(parseRes)
            return parseRes.post
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getAllReport()
    }, []);

    useEffect(() => {
        getAllReport()
    }, [report]);

    const onClick = (post) => {
        props.setPagearr(['detail'])
        getPost(post).then(() => {
            props.setPage('detail')
        })
    }

    const acceptReport = async (report_id) => {
        try {
            const url = await `${process.env.REACT_APP_API_URL}/admin/acceptreport`
            const respone = await fetch(url, {
                method: "post",
                headers: { "content-type": "application/json", token: localStorage.getItem("token") },
                body: JSON.stringify({ report_id: report_id })
            })
            const data = await respone.json().then(() => setReport(report_id))
        } catch (error) {
            console.log(error.message)
        }
    }
    const rejectReport = async (report_id) => {
        try {
            const url = await `${process.env.REACT_APP_API_URL}/admin/rejectreport`
            const respone = await fetch(url, {
                method: "post",
                headers: { "content-type": "application/json", token: localStorage.getItem("token") },
                body: JSON.stringify({ report_id: report_id })
            })
            const data = await respone.json().then(() => setReport(report_id))

        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <Fragment>
            <table className="border-collapse border border-slate-400 table-auto w-full mt-3">
                <thead>
                    <tr>
                        <th className="border border-slate-300 ...">STT</th>
                        <th className="border border-slate-300 ...">Title of post</th>
                        <th className="border border-slate-300 ...">Nội dung báo cáo</th>
                        <th className="border border-slate-300 ...">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report, index) => (
                        <tr key={index}>
                            <td className="border border-slate-300 ...">{index}</td>
                            <td className="border border-slate-300 ..." style={{ color: 'blue' }} onClick={() => { onClick(report.post_id) }}>{report.post.title}</td>
                            <td className="border border-slate-300 ...">{report.content}</td>
                            <td className="border border-slate-300 ...">{report.create_on}</td>
                            <td className="border border-slate-300 ..."><button type="" className="btn btn-primary" onClick={() => { acceptReport(report.report_id) }}>chấp nhận</button></td>
                            <td className="border border-slate-300 ..."><button type="" className="btn btn-secondary" onClick={() => { rejectReport(report.report_id) }}>từ chối</button></td>


                        </tr>
                    ))}

                </tbody>
            </table>
        </Fragment>
    )
}