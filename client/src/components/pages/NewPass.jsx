import logo from "../../img/logo/logo.png";
import React, { Fragment, useEffect, useState } from "react";
import Toast from "../notify/Toast";

export default function NewPass() {
    const paramString = window.location.search
    const params = new URLSearchParams(paramString)
    const user_id = params.get('userId')
    const data = {
        user_id: user_id,
    }
    const [inputs, setInputs] = useState({
        newPass: "",
        reType: "",
    })

    console.log(data)
    const reTypeRef = React.createRef()

    const [noti, setNoti] = useState(false)
    const [notiMessage, setNotiMessage] = useState("")


    const { newPass, reType } = { ...inputs }
    const onChange = e => {
        if (e.target.type == 'checkbox') {
            setInputs({ ...inputs, [e.target.name]: e.target.checked })
        }
        else {
            setInputs({ ...inputs, [e.target.name]: e.target.value })
        }
    }
    useEffect(() => {
        console.log(newPass, reType)
        const e = reTypeRef.current
        if (reType !== newPass) {
            e.classList.add('warning')
        }
        else {
            e.classList.remove('warning')
        }
    }, [reType])

    const onSubmitForm = async e => {
        e.preventDefault()
        if (reType !== newPass) {
            setNoti('red')
            setNotiMessage('Hãy xác nhận mật khẩu')
            setTimeout(() => {
                setNoti('')
                setNotiMessage('')
            }, 3000);
            return 0
        }
        const params = { password: inputs.newPass, user_id: user_id }
        console.log(params)
        try {
            const url = await `${process.env.REACT_APP_API_URL}/auth/newpassword`
            const respone = await fetch(url, {
                method: "post",
                headers: { "content-Type": "application/json" },
                body: JSON.stringify(params)
            })
            const parseRes = await respone.json()
            console.log(parseRes)
            if (respone.status === 202) {
                localStorage.removeItem('token')
                window.location.href = '/login'
            } else {
                setNoti('red')
                setTimeout(() => {
                    setNoti('')
                }, 3000);
                setNotiMessage(parseRes.message)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <Fragment>

            <div className="form-login flex flex-col justify-center items-center h-screen bg-gray-50  ">
                {/* start logo form */}
                <div className="form-logo">
                    <a
                        href="#"
                        className="flex justify-center items-center text-2xl font-medium text-gray-900 "
                    >
                        <img src={logo} className="h-16 w-16 object-cover" alt="ảnh" />
                    </a>
                </div>
                {/* end logo-form */}
                {/* start form-container */}
                <div className="form-container w-full max-w-xs bg-white shadow rounded">
                    <div className="p-6 space-y-4">
                        <h1 className="text-gray-800 text-xl text-center font-bold leading-tight tracking-tight ">
                            Đổi mật khẩu
                        </h1>
                        <form action="#" className="flex flex-col" onSubmit={onSubmitForm}>
                            <div className="form-password text-left">
                                <label
                                    htmlFor="newPass"
                                    className="block text-gray-800  mb-2 text-sm font-medium"
                                >
                                    Mật khẩu mới
                                </label>
                                <input
                                    value={newPass}
                                    onChange={e => onChange(e)}
                                    type="password"
                                    className="w-full mb-4 p-2.5 rounded-lg border text-gray-800 bg-gray-50 border-gray-300  focus:outline-none  focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="name@company.com"
                                    name="newPass"
                                    id="newPass"
                                />
                            </div>
                            <div className="form-password text-left">
                                <label
                                    htmlFor="email"
                                    className="block text-gray-800  mb-2 text-sm font-medium"
                                >
                                    Nhập lại mật khẩu
                                </label>
                                <input
                                    ref={reTypeRef}
                                    value={reType}
                                    onChange={e => onChange(e)}
                                    type="password"
                                    className="w-full mb-4 p-2.5 rounded-lg border text-gray-800 bg-gray-50 border-gray-300  focus:outline-none  focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="••••••••"
                                    name="reType"
                                    id="reType"
                                />
                            </div>
                            <button
                                type="submit"
                                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 font-medium text-sm px-5 py-2.5 my-1 rounded"
                            >
                                Thay đổi
                            </button>
                        </form>
                    </div>
                </div>
                {/* end form-container */}
                <Toast showed={noti} message={notiMessage} />
            </div>
        </Fragment>
    );
}
