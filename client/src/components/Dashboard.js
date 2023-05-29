import React, { Fragment, useEffect, useState } from "react";


const Dashboard = ({ setAuth, isAuthenticated }) => {
    const [name, setName] = useState()
    const getName = async () => {
        try {
            const respone = await fetch("http://localhost:5000/dashboard/", {
                method: "GET",
                headers: { token: localStorage.token }
            })
            const parseRes = await respone.json()
            setName(parseRes.user_name)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getName()
    },[isAuthenticated])

    const Logout = (e) =>{
        // e.preventDefault()
        setAuth(false)
        localStorage.removeItem("token")
    }
    return (
        <Fragment>
            <h1>
                Dashboard {name}
            </h1>
            <button className="btn-secondary btn" onClick={(e) => Logout(e)}>Logout</button>
        </Fragment>
    )
}
export default Dashboard;