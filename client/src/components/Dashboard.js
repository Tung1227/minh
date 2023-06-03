import React, { Fragment, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
    const navigate = useNavigate();
    const ref = useRef(null);
    const [name, setName] = useState()

    const getName = async () => {
        try {
            const respone = await fetch("http://localhost:5000/dashboard/", {
                method: "GET",
                headers: { token: localStorage.getItem("token") }
            })

            const parseRes = await respone.json()
            setName(parseRes.user_name)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getName()
    }, [])

    const Logout = (e) => {
        e.preventDefault()
        localStorage.removeItem("token")
        navigate('/login')
    }

    return (
        <Fragment>
            <h1 id="name" ref={ref}>
                Dashboard {name}
            </h1>
            <button className="btn-secondary btn" onClick={(e) => Logout(e)} >Logout</button>
        </Fragment>
    )
}
export default Dashboard;