import React, { Fragment } from "react";
import { useParams } from "react-router-dom";
const verify = () => {
    const p = useParams();
    return (
        <Fragment>
            <div className="container" style={{ textAlign: 'center' }}>Verifing...</div>
        </Fragment>
    )
};

export default verify;