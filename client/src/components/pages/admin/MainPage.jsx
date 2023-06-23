import {
    Tab,
    TabPanel,
    Tabs,
    TabsBody,
    TabsHeader,
} from "@material-tailwind/react";
import React, { Fragment, useEffect, useState } from "react";
import 'react-chat-widget/lib/styles.css';
import Breadcrumbs from "../Breadcrumbs";
import Footer from "../Footer";
import NavBar from "../NavBar";
import PostDetail from "../PostDetail";
import ListPost from "./ListPost";
import ListReport from "./ListReport";

const buttons = [{ label: 'first', value: '1' }, { label: 'second', value: '2' }];

export default function MainPage() {
    const [fillterModal, setFillterModal] = useState(false);
    const [logined, setLogined] = useState(false);
    const [userinfo, setUserInfo] = useState()
    const [page, setPage] = useState('list')
    const [noti, setNoti] = useState(true)
    const [notiMessage, setNotiMessage] = useState("")
    const [posts, setPosts] = useState([])
    const [cities, setCities] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [postDetail, setPostDetail] = useState({})



    const isVerify = async () => {
        try {
            const url = await `${process.env.REACT_APP_API_URL}/auth/is-verify`
            const respone = await fetch(url, {
                method: 'GET',
                headers: { token: localStorage.token }
            })

            const parseRes = await respone.json()
            console.log(parseRes.account_type)
            if (!parseRes.message) {
                if (parseRes.account_type == 'admin') {
                    setUserInfo(parseRes)
                }
                else {
                    window.location.href = 'dashboard'
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        isVerify()
    }, []);

    const searchPost = async (parmas) => {
        try {
            const url_search = `${process.env.REACT_APP_API_URL}/chatbot/searchpost`
            const respon_search = await fetch(url_search, {
                method: 'POST',
                headers: { "content-Type": "application/json" },
                body: JSON.stringify(parmas),
            })
            const parseRes = await respon_search.json()
            console.log(parseRes)
            parseRes.posts.map((post, index) => {
                const detail_post = [{
                    price: post.price,
                    image_file: post.image_file
                }]
                parseRes.posts[index] = { ...post, detail_post }
            })
            setPosts(parseRes.posts)
        } catch (error) {
            console.log(error.message);
        }
    }
    const clickTab = (e) => {
        console.log(document.getElementsByClassName('tab'))
        const elements = document.getElementsByClassName('tab')
        for(var i = 0; i < elements.length; i++){
            console.log(elements[i])
            elements[i].style.backgroundColor = "unset";
        }
        e.tartget.style.backgroundColor = 'turquoise'
    }

    return (
        <Fragment>
            <NavBar setFillterModal={setFillterModal} logined={logined} user={userinfo} setPage={setPage} page={page} />
            <div className="text-left">
                <Breadcrumbs page={page} setPage={setPage} />
            </div>
            <div className="container">
                <div class="w-full">
                    <div class="relative right-0">
                        <ul
                            class="relative flex list-none flex-wrap rounded-lg bg-blue-gray-50/60 p-1"
                            data-tabs="tabs"
                            role="list"
                        >
                            <li class="z-30 flex-auto text-center">
                                <a onClick={(e) => { clickTab(e) }}
                                    value='list'
                                    class="tab text-slate-700 z-30 mb-0 flex w-full cursor-pointer items-center justify-center rounded-lg border-0 bg-inherit px-0 py-1 transition-all ease-in-out"
                                    data-tab-target=""
                                    active
                                    role="tab"
                                    aria-selected="true"
                                >
                                    <span class="ml-1">Bài đăng mới</span>
                                </a>
                            </li>
                            <li class="z-30 flex-auto text-center">
                                <a onClick={(e) => { clickTab(e) }}
                                    value='detail'
                                    class="tab text-slate-700 z-30 mb-0 flex w-full cursor-pointer items-center justify-center rounded-lg border-0 bg-inherit px-0 py-1 transition-all ease-in-out"
                                    data-tab-target=""
                                    role="tab"
                                    aria-selected="false"
                                >
                                    <span class="ml-1">Báo cáo mới</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    )
}