import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
const Login = () => {
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate();

    const isVerify = async () =>{
        const respone = await fetch("http://localhost:5000/auth/is-verify/", {
            method: 'GET',
            headers: { token: localStorage.token }
        })

        const parseRes = await respone.json()
        console.log(parseRes)
        parseRes === true ? navigate('/dashboard') : navigate('/login')
    }
    useEffect( () => {
        isVerify()
    }, []);

    const { email, password } = { ...inputs }
    const onChange = e => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const onSubmitForm = async e => {
        e.preventDefault()
        const params = { ...inputs }
        console.log(params)
        try {
            const respone = await fetch("http://localhost:5000/auth/login", {
                method: "post",
                headers: { "content-Type": "application/json" },
                body: JSON.stringify(params)
            })
            const parseRes = await respone.json()
            console.log(parseRes)
            if (parseRes.token) {
                localStorage.setItem("token", parseRes.token)
                navigate('/dashboard');
            } else {

            }
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <Fragment>
            <h1 className="text-center my-5">
                Login
            </h1>
            <form onSubmit={onSubmitForm}>
                <input type="email" name="email" placeholder="email" className="form-control my-3" value={email} onChange={(e) => onChange(e)}></input>
                <input type="password" name="password" placeholder="password" className="form-control my-3" value={password} onChange={(e) => onChange(e)}></input>
                <button className="btn-success btn btn-block my-3">Submit</button>
            </form>
            <Link
                to="/register"
            >Register</Link>
        </Fragment>
    )
}
export default Login;