import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");


    const getName = async () => {
        try {
            const respone = await fetch("http://localhost:5000/dashboard/", {
                method: "GET",
                headers: { token: localStorage.getItem("token") }
            })
            const parseRes = await respone.json()
            console.log(parseRes)
            setName(parseRes.user_name)
        } catch (error) {
            console.log(error.message)
        }
    }
    const isVerify = async () =>{
        const respone = await fetch("http://localhost:5000/auth/is-verify/", {
            method: 'GET',
            headers: { token: localStorage.token }
        })

        const parseRes = await respone.json()
        console.log(parseRes)
        parseRes === true ? getName() : navigate('/login')
    }
    useEffect( () => {
        isVerify()
    }, []);

    const Logout = (e) => {
        localStorage.removeItem("token")
        navigate('/login')
    }

    return (
        <Fragment>
            <h1 id="name" >
                Dashboard {name}
            </h1>
            <button className="btn-secondary btn" onClick={() => Logout()} >Logout</button>
        </Fragment>
    )
}
export default Dashboard;