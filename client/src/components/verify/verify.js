import React, { Fragment } from "react";
import { useParams } from "react-router";
const verify = async () => {
    const paramString = window.location.search
    const params = new URLSearchParams(paramString)
    const respone = await fetch("http://localhost:5000/auth/verify", {
        method: 'GET',
        body: {
            user_id: params.get('userId')
        }
    })
    return (
        <Fragment>
            <div className="container" style={{ textAlign: 'center' }}>Verifing...</div>
        </Fragment>
    )
};

export default verify;