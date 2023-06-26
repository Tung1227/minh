import {
    Tab,
    TabPanel,
    Tabs,
    TabsBody,
    TabsHeader,
} from "@material-tailwind/react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import 'react-chat-widget/lib/styles.css';
import Breadcrumbs from "../Breadcrumbs";
import Footer from "../Footer";
import NavBar from "../NavBar";
import PostDetail from "../PostDetail";
import ListPost from "./ListPost";
import ListReport from "./ListReport";

const mainPage = 'post'

export default function MainPage() {
    const [fillterModal, setFillterModal] = useState(false);
    const [logined, setLogined] = useState(false);
    const [userinfo, setUserInfo] = useState()
    const [page, setPage] = useState('post')
    const [postDetail, setPostDetail] = useState({})
    const [pagearr, setPagearr] = useState([])
    const [from, setFrom] = useState('')
    const postRef = useRef()
    const reportRef = useRef()
    const updateRef = useRef()



    const isVerify = async () => {
        try {
            const url = await `${process.env.REACT_APP_API_URL}/auth/is-verify`
            const respone = await fetch(url, {
                method: 'GET',
                headers: { token: localStorage.token }
            })

            const parseRes = await respone.json()
            if (!parseRes.message) {
                setLogined(true)
                setUserInfo(parseRes)
                if (parseRes.account_type == 'admin') {
                    setUserInfo(parseRes)
                }
                else {
                    window.location.href = '/dashboard'
                }
            } else {
                window.location.href = '/login'
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        isVerify()
        setPage('post')
        postRef.current.style.backgroundColor = 'turquoise'
    }, []);

    useEffect(() => {
        const elements = document.getElementsByClassName('tab')
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = "unset";
        }
        if (page == 'post') {
            setFrom('post')
            postRef.current.style.backgroundColor = 'turquoise'
        }
        else if (page == 'report') {
            setFrom('report')
            reportRef.current.style.backgroundColor = 'turquoise'
        }
        else if (page == 'update') {
            setFrom('update')
            updateRef.current.style.backgroundColor = 'turquoise'
        }
    }, [page]);

    const clickTab = (value) => {
        console.log(value)
        const elements = document.getElementsByClassName('tab')
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = "unset";
        }
        if (value == 'post') {
            setPage('post')
        } else if (value == 'report') {
            reportRef.current.style.backgroundColor = 'turquois'
            setPage('report')
        } else if (value == 'update') {
            setPage('update')
        }
    }


    return (
        <Fragment>
            <NavBar setFillterModal={setFillterModal} logined={logined} user={userinfo} setPage={setPage} page={page} />
            <div className="text-left">
                <Breadcrumbs page={page} setPage={setPage} mainPage={mainPage} pagearr={pagearr} setPagearr={setPagearr} from={from} />
            </div>
            {(page != 'detail') && <div className="container">
                <div className="" style={{width:'600px'}}>
                    <div className="relative right-0">
                        <ul
                            className="relative flex list-none flex-wrap rounded-lg bg-blue-gray-50/60 p-1"
                            data-tabs="tabs"
                            role="list"
                        >
                            <li className="z-30 flex-auto text-center">
                                <a ref={postRef}
                                    className="tab text-slate-700 z-30 mb-0 flex w-full cursor-pointer items-center justify-center rounded-lg border-0 bg-inherit px-0 py-1 transition-all ease-in-out"
                                    data-tab-target=""
                                    role="tab"
                                    aria-selected="true"
                                >
                                    <span className="ml-1" onClick={(e) => { clickTab('post') }} >Bài đăng mới</span>
                                </a>
                            </li>
                            <li className="z-30 flex-auto text-center">
                                <a ref={reportRef}
                                    className="tab text-slate-700 z-30 mb-0 flex w-full cursor-pointer items-center justify-center rounded-lg border-0 bg-inherit px-0 py-1 transition-all ease-in-out"
                                    data-tab-target=""
                                    role="tab"
                                    aria-selected="false"
                                >
                                    <span className="ml-1" onClick={(e) => { clickTab('report') }}>Báo cáo mới</span>
                                </a>
                            </li>
                            <li className="z-30 flex-auto text-center">
                                <a ref={updateRef}
                                    className="tab text-slate-700 z-30 mb-0 flex w-full cursor-pointer items-center justify-center rounded-lg border-0 bg-inherit px-0 py-1 transition-all ease-in-out"
                                    data-tab-target=""
                                    role="tab"
                                    aria-selected="false"
                                >
                                    <span className="ml-1" onClick={(e) => { clickTab('update') }}>Bài đăng đã sửa</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                {(page == 'post' || page == 'update') && < ListPost from={from} page={page} setPostDetail={setPostDetail} setPage={setPage} pagearr={pagearr} setPagearr={setPagearr} />}
                {(page == 'report') && < ListReport page={page} setPostDetail={setPostDetail} setPage={setPage} pagearr={pagearr} setPagearr={setPagearr} />}
            </div>}
            {(page == 'Chi tiết') && <PostDetail from={from} post={postDetail} setPost={setPostDetail} logined={logined} userinfo={userinfo} setPage={setPage} mainPage={mainPage} />}
        </Fragment>
    )
}