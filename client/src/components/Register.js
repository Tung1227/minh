import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        email: "",
        name: "",
        password: ""
    })

    const { email, name, password } = inputs

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const onSubmitForm = async e => {
        e.preventDefault()
        const params = { email, name, password }

        try {
            const respone = await fetch("http://localhost:5000/auth/register", {
                method: "post",
                headers: { "content-Type": "application/json" }
                ,
                body: JSON.stringify(params)
            })
            const parseRes = await respone.json()

            console.log(parseRes)

            localStorage.setItem("token", parseRes.token)
            navigate('/dashboard');
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        if (localStorage.getItem('token') !== null) {
            navigate('/dashboard');
        }
    })
    return (
        <Fragment>
            <h1 className="text-center my-5">
                Register
            </h1>
            <form>
                <input type="email" name="email" placeholder="email" className="form-control my-3" value={email} onChange={(e) => onChange(e)}></input>
                <input type="name" name="name" placeholder="name" className="form-control my-3" value={name} onChange={(e) => onChange(e)}></input>
                <input type="password" name="password" placeholder="" className="form-control my-3" value={password} onChange={(e) => onChange(e)}></input>
                <button className="btn-success btn btn-block my-3" onClick={(e) => { onSubmitForm(e) }}>Submit</button>
            </form>
        </Fragment>
    )
}
export default Register;