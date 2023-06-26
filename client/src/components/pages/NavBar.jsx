import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../../img/logo/logo.png";
import { useNavigate } from "react-router";


const navigation = [
  { name: "Dashboard", href: "/dashboard", current: true },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar(props) {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState()
  const { logined, user } = { ...props }
  const onClick = (e) => {
    // e.preventDefault();
    props.setFillterModal(true);
  }

  const changePage = () => {
    props.setPagearr(['Tạo tin mới'])
    props.setPage('Tạo tin mới')
  }
  useEffect(() => {
    setUserInfo(user)
  }, [user])
  const Logout = (e) => {
    localStorage.removeItem("token")
    window.location.href = '/login'
  }

  const Profile = (e) => {
    props.setPage('Thông tin cá nhân')
    props.setPagearr(['Thông tin cá nhân'])
  }

  const listpost = (e) => {
    props.setPage('Tin đã đăng')
    props.setPagearr(['Tin đã đăng'])
    props.setFrom('Tin đã đăng')
  }

  const changePass = () => {
    navigate('/repass', { state: userInfo.user_id })
  }
  return (
    <Disclosure as="nav" className="bg-slate-300" style={{ backgroundColor: 'rgb(203 213 225)' }}>
      {(open) =>
      (
        <>
          <div className="max-w-10xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-light-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="block h-8 w-auto lg:hidden"
                    src={logo}
                    alt="Your Company"
                  />
                  <img
                    className="hidden h-8 w-auto lg:block"
                    src={logo}
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  data-modal-target="authentication-modal"
                  data-modal-toggle="authentication-modal"
                  type="button"
                  className="rounded-full bg-light-800 p-1 text-gray-400 hover:text-gray focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 focus:ring-offset-light-800"
                  onClick={(e) => {
                    onClick(e);
                  }}
                >
                  <span className="sr-only">View notifications</span>
                  {(props.page == 'list') && <FunnelIcon className="h-6 w-6" aria-hidden="true" style={{ color: "black" }} />}
                </button>

                {/* Profile dropdown */}
                {logined && <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-light-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-light-800">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={(userInfo != undefined) && (process.env.REACT_APP_MEDIA_URL + userInfo.userinfo[0].avatar_img)}
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a onClick={(e) => {
                            Profile(e)
                          }}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Thông tin cá nhân
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a onClick={(e) => {
                            listpost(e)
                          }}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Tin đã đăng
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a onClick={(e) => changePass(e)}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Đổi mật khẩu
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={(e) => Logout(e)}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>}
                {!logined && <button onClick={() => { window.location.href = '/login' }}
                  type="button" className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 relative ml-3">Login</button>}
                {logined && <button onClick={() => { changePage() }}
                  type="button" className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 relative ml-3">Tạo tin mới</button>}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}

    </Disclosure>

  );
}
