import React, { Fragment, useEffect } from "react";


const Verify = () => {
    const paramString = window.location.search
    const params = new URLSearchParams(paramString)
    const user_id = params.get('userId')
    const token = params.get('token')
    const data = {
        user_id: user_id,
        jwt_token: token
    }
    console.log(data)
    const verifing = async () => {
        try {
            const respone = await fetch("http://localhost:5000/auth/verify", {
                method: 'post',
                headers: { "content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            const parseRes = await respone.json()
            console.log(parseRes)
            if(respone.status === 202){
                localStorage.setItem('token', token)
                window.location.href = '/dashboard'
            }
            
        } catch (error) {
            console.log(error.message)
        }
    };

    useEffect(() => {
        verifing()
    }, [])

    return (
        <Fragment>
            <div className="container" style={{ textAlign: 'center' }}>Verifing...</div>
        </Fragment>
    )
};

export default Verify;