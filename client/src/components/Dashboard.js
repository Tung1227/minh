import React, { Fragment, useEffect, useState } from "react";


const Dashboard = () => {
    const [name, setName] = useState()

    useEffect(async () => {
        try {
            const respone = await fetch("http://localhost:5000/dashboard/", {
                method: "GET",
                headers: { token: localStorage.getItem("token") }
            })

            const parseRes = respone.json()
        } catch (error) {

        }


    }, [])

    return (
        <Fragment>
            <h1 id="name">
                Dashboard {name}
            </h1>
            <button className="btn-secondary btn" >Logout</button>
        </Fragment>
    )
}
export default Dashboard;