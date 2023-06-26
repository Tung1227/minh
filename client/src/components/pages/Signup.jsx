import logo from "../../img/logo/logo.png";
import checkForm from "../../events/checkForm";
import React, { useEffect, useState, Fragment } from "react";
import Toast from "../notify/Toast";

export default function Signup() {
  const [inputs, setInputs] = useState({
    email: "",
    name: "",
    password: "",
    rePassword: ""
  })

  const [noti, setNoti] = useState(false)
  const [notiMessage, setNotiMessage] = useState("")

  const { email, name, password, rePassword } = { ...inputs }

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }
  useEffect(() => {
    checkForm(inputs)
  }, [inputs])

  const onSubmitForm = async e => {
    e.preventDefault()
    const params = { email, name, password }
    checkForm(inputs)
    try {
      const url = await `${process.env.REACT_APP_API_URL}/auth/register`
      const respone = await fetch(url, {
        method: "post",
        headers: { "content-Type": "application/json" }
        ,
        body: JSON.stringify(params)
      })
      const parseRes = await respone.json()
      console.log(parseRes)
      if (respone.status !== 401) {
        setNoti('green')
        setNotiMessage(parseRes.message)
      }
      else {
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

  const isVerify = async () => {
    const url = await `${process.env.REACT_APP_API_URL}/auth/is-verify`
    const respone = await fetch(url, {
      method: 'GET',
      headers: { token: localStorage.token }
    })
    const parseRes = await respone.json()
    if (!parseRes.message) {
      if (parseRes.account_type == 'admin') {
        window.location.href = '/admin'
      }
      else if (parseRes.account_type == 'user') {
        window.location.href = '/dashboard'

      }
    }
  }
  useEffect(() => {
    isVerify()
  }, []);


  return (
    <Fragment>
      <div className="form-login flex flex-col justify-center items-center h-screen bg-gray-50 ">
        {/* start logo form */}
        <div className="form-logo">
          <a
            href="#"
            className="flex justify-center items-center text-2xl font-medium text-gray-900"
          >
            <img src={logo} className="h-16 w-16 object-cover" alt="ảnh" />
          </a>
        </div>
        {/* end logo-form */}
        {/* start form-container */}
        <div className="form-container w-full max-w-xs bg-white shadow  dark:bg-gray-800 dark:border-gray-700 rounded">
          <div className="p-6 space-y-4">
            <h1 className="text-gray-800 text-xl text-center font-bold leading-tight tracking-tight ">
              Đăng Ký
            </h1>
            <form action="#" className="flex flex-col" onSubmit={onSubmitForm}>
              <div className="form-email">
                <label
                  htmlFor="name"
                  className="block text-gray-800 mb-2 text-sm font-medium text-left"
                >
                  Tên của Bạn
                </label>
                <input
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={e => onChange(e)}
                  type="name"
                  className="w-full mb-4 p-2.5 rounded-lg border text-gray-800 bg-gray-50 border-gray-300 focus:outline-none  focus:ring-blue-500 focus:border-blue-500"
                  name="name"
                  id="name"
                />
              </div>
              <div className="form-email">
                <label
                  htmlFor="email"
                  className="block text-gray-800 mb-2 text-sm font-medium text-left"
                >
                  Email của Bạn
                </label>
                <input
                  value={email}
                  onChange={e => onChange(e)}
                  type="email"
                  className="w-full mb-4 p-2.5 rounded-lg border text-gray-800 bg-gray-50 border-gray-300 focus:outline-none  focus:ring-blue-500 focus:border-blue-500"
                  placeholder="name@company.com"
                  name="email"
                  id="email"
                />
              </div>
              <div className="form-password">
                <label
                  htmlFor="password"
                  className="block text-gray-800 mb-2 text-sm font-medium text-left"
                >
                  Mật Khẩu
                </label>
                <input
                  value={password}
                  onChange={e => onChange(e)}
                  type="password"
                  className="w-full mb-4 p-2.5 rounded-lg border text-gray-800 bg-gray-50 border-gray-300 focus:outline-none  focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  name="password"
                  id="password"
                />
              </div>
              <div className="form-password">
                <label
                  htmlFor="re-password"
                  className="block text-gray-800 mb-2 text-sm font-medium text-left"
                >
                  Nhập Lại Mật Khẩu
                </label>
                <input
                  value={rePassword}
                  onChange={e => onChange(e)}
                  type="password"
                  className="w-full mb-4 p-2.5 rounded-lg border text-gray-800 bg-gray-50 border-gray-300 focus:outline-none  focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  name="rePassword"
                  id="rePassword"
                />
              </div>
              <button
                type=""
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 font-medium text-sm px-5 py-2.5 my-1 rounded"
                id="singup"
              >
                Đăng Ký
              </button>
              <p className="text-gray-800 mt-3 font-normal text-sm">
                Bạn Đã Có Tài Khoản?
                <a href="/login" className="ml-1 text-blue-500 ">
                  Đăng nhập
                </a>
              </p>
            </form>
          </div>
        </div>
        {/* end form-container */}
        <Toast showed={noti} message={notiMessage} />
      </div>
    </Fragment>
  );
}
