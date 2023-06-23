import logo from "../../img/logo/logo.png";
import checkForm from "../../events/checkForm";
import React, { Fragment, useEffect, useState } from "react";
import Toast from "../notify/Toast";

export default function LoginPage() {

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    saveToken: false
  })

  const [noti, setNoti] = useState(true)
  const [notiMessage, setNotiMessage] = useState("")


  const isVerify = async () => {
    const url = await `${process.env.REACT_APP_API_URL}/auth/is-verify`
    const respone = await fetch(url, {
      method: 'GET',
      headers: { token: localStorage.token }
    })
    const parseRes = await respone.json()
    console.log(parseRes)
    if (!parseRes.message) { window.location.href = '/dashboard' }
  }
  useEffect(() => {
    isVerify()
  }, []);

  const { email, password, saveToken } = { ...inputs }
  const onChange = e => {
    if (e.target.type == 'checkbox') {
      setInputs({ ...inputs, [e.target.name]: e.target.checked })
    }
    else {
      setInputs({ ...inputs, [e.target.name]: e.target.value })
    }
  }

  let timeout = null
  const onSubmitForm = async e => {
    e.preventDefault()
    const params = { ...inputs }
    try {
      setNoti('')
      const url = await `${process.env.REACT_APP_API_URL}/auth/login`
      const respone = await fetch(url, {
        method: "post",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(params)
      })
      const parseRes = await respone.json()
      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token)
        window.location.href = '/dashboard'
      } else {
        clearTimeout(timeout)
        setNoti('red')
        setNotiMessage(parseRes.message)
        timeout = setTimeout(() => {
          setNoti('')
        }, 3000)
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
              Đăng Nhập
            </h1>
            <form action="#" className="flex flex-col" onSubmit={onSubmitForm}>
              <div className="form-email text-left">
                <label
                  htmlFor="email"
                  className="block text-gray-800  mb-2 text-sm font-medium"
                >
                  Email của Bạn
                </label>
                <input
                  value={email}
                  onChange={e => onChange(e)}
                  type="email"
                  className="w-full mb-4 p-2.5 rounded-lg border text-gray-800 bg-gray-50 border-gray-300  focus:outline-none  focus:ring-blue-500 focus:border-blue-500"
                  placeholder="name@company.com"
                  name="email"
                  id="email"
                />
              </div>
              <div className="form-password text-left">
                <label
                  htmlFor="email"
                  className="block text-gray-800  mb-2 text-sm font-medium"
                >
                  Mật Khẩu
                </label>
                <input
                  value={password}
                  onChange={e => onChange(e)}
                  type="password"
                  className="w-full mb-4 p-2.5 rounded-lg border text-gray-800 bg-gray-50 border-gray-300  focus:outline-none  focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  name="password"
                  id="password"
                />
              </div>
              <div className="flex justify-between items-center text-gray-800  my-3">
                <div className="flex">
                  <div className="h-5">
                    <input
                      checked={saveToken}
                      onChange={e => onChange(e)}
                      name="saveToken"
                      id="remember"
                      type="checkbox"
                      aria-describedby="remember"
                      className="
                                w-4 h-4
                                 pointer-events-auto
                                 cursor-pointer
                                 outline-none
                                 border border-gray-300 rounded
                                  bg-gray-50 focus:ring-3 focus:ring-primary-300
                                   dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600
                                    dark:ring-offset-gray-800 checked:bg-primary-500"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="remember">Lưu Thông Tin</label>
                  </div>
                </div>
                <a href="/inputmail" className="text-blue-500">
                  Quên Mật Khẩu?
                </a>
              </div>
              <button
                type="submit"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 font-medium text-sm px-5 py-2.5 my-1 rounded"
              >
                Đăng Nhập
              </button>
              <p className="text-gray-800  mt-3 font-normal text-sm">
                Bạn Chưa Có Tài Khoản?
                <a href="/signup" className="ml-1 text-blue-500 ">
                  Đăng ký
                </a>
              </p>
            </form>
          </div>
        </div>
        {/* end form-container */}
        {noti && <Toast showed={noti} message={notiMessage} setNoti={setNoti} />}
      </div>
    </Fragment>
  );
}
