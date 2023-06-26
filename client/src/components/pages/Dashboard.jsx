import React, { Fragment, useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";
import FillterModal from "./FillterModal";
import PostDetail from "./PostDetail";
import Footer from "./Footer";
import Listpost from "./Listpost";
import CreatePost from "./CreatePost";
import Breadcrumbs from "./Breadcrumbs";
import Toast from "../notify/Toast";
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage, setQuickButtons } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import { useCookies } from "react-cookie";
import Profile from "./Profile";
import Listposted from "./Listposted";
import UpdatePost from "./UpdatePost";

const buttons = [{ label: 'first', value: '1' }, { label: 'second', value: '2' }];
const mainPage = 'list'

export default function Dashboard() {
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
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [pagearr, setPagearr] = useState([''])
    const [from, setFrom] = useState('')



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
                setUserInfo(parseRes)
                if (parseRes.account_type == 'admin') {
                    window.location.href = 'admin'
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        // console.log(userinfo)
        if (userinfo != undefined) {
            setLogined(true)
        }
    }, [userinfo]);


    useEffect(() => {
        isVerify()
        addResponseMessage('Xin chào!!!');
        addResponseMessage('Hãy đặt câu hỏi cho tôi');
        window.addEventListener('beforeunload', clearCookie);
        // setQuickButtons(buttons);
    }, []);

    const clearCookie = () => {
        removeCookie('cookie-name', { path: '/' });
    };
    const searchPost = async (parmas) => {
        try {
            console.log(cookies.price, 'p')
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
            return parseRes.posts
        } catch (error) {
            console.log(error.message);
        }
    }
    // useEffect(() => {
    //     searchPost()
    // }, [cookies])
    const handleNewUserMessage = async (newMessage) => {
        console.log(`New message incoming! ${newMessage}`);
        const params = { text: newMessage }
        try {
            const url = `${process.env.REACT_APP_CHATBOT_URL}`
            const respone = await fetch(url, {
                method: 'POST',
                headers: { "content-Type": "application/json" },
                body: JSON.stringify(params),
                credentials: 'include'
            })
            const parseRes = await respone.json()
            if (parseRes.message) {
                addResponseMessage(parseRes.message);
                console.log(parseRes.message)
            }
            else {
                addResponseMessage('Đang tìm kiếm...');
                setCookie('price', parseRes.res.Price, { path: '/dashboard', expires: 0 });
                setCookie('water_price', parseRes.res.Water, { path: '/dashboard', expires: 0 });
                setCookie('electric_price', parseRes.res.Elec, { path: '/dashboard', expires: 0 });
                setCookie('air_condition', parseRes.res.Air_condition, { path: '/dashboard', expires: 0 });
                setCookie('washing', parseRes.res.Washing, { path: '/dashboard', expires: 0 });
                setCookie('location', parseRes.res.Location, { path: '/dashboard', expires: 0 });
                const params = {
                    'price': parseRes.res.Price,
                    'water_price': parseRes.res.Water,
                    'electric_price': parseRes.res.Elec,
                    'air_condition': parseRes.res.Air_condition == '1' ? true : false,
                    'washing': parseRes.res.Washing == '1' ? true : false,
                    'location': parseRes.res.Location
                }
                const finded = await searchPost(params)
                if (finded.length > 0) {
                    addResponseMessage('Đã Tìm thấy nhà trọ');
                }
                else {
                    addResponseMessage('Không tìm thấy nhà trọ theo yêu cầu của bạn');
                }

            }
        } catch (error) {

        }
    };

    const handleQuickButtonClicked = data => {
        console.log(data);
        setQuickButtons(buttons.filter(button => button.value !== data));
    };
    return (
        <Fragment>
            <NavBar setFillterModal={setFillterModal} logined={logined} user={userinfo} setPage={setPage} page={page} setPagearr={setPagearr} setFrom={setFrom} />
            <div className="text-left">
                <Breadcrumbs page={page} setPage={setPage} mainPage={mainPage} pagearr={pagearr} setPagearr={setPagearr} from={from} />
            </div>
            {(page == 'list') && <FillterModal fillterModal={fillterModal} setFillterModal={setFillterModal} cities={cities} districts={districts}
                wards={wards} setCities={setCities} setDistricts={setDistricts} setWards={setWards} setPosts={setPosts} />}
            {(page == 'list') && <Listpost posts={posts} setPosts={setPosts} setPage={setPage} setPostDetail={setPostDetail} setPagearr={setPagearr} />}
            {(page == 'detail') && <PostDetail setPage={setPage} mainPage={mainPage} setNoti={setNoti} setNotiMessage={setNotiMessage} post={postDetail} setPost={setPostDetail} logined={logined} userinfo={userinfo} />}
            {(page == 'create') && <CreatePost setNoti={setNoti} setNotiMessage={setNotiMessage} cities={cities} districts={districts} wards={wards} setCities={setCities} setDistricts={setDistricts} setWards={setWards} />}
            {(page == 'profile') && <Profile setNoti={setNoti} setNotiMessage={setNotiMessage} cities={cities} districts={districts} wards={wards} setCities={setCities} setDistricts={setDistricts} setWards={setWards} />}
            {(page == 'Tin đã đăng' && <Listposted posts={posts} setPosts={setPosts} setPage={setPage} setPostDetail={setPostDetail} setPagearr={setPagearr} />)}
            {(page == 'Chỉnh sửa bài đăng') && <UpdatePost setNoti={setNoti} setNotiMessage={setNotiMessage} post={postDetail} setPost={setPostDetail} cities={cities} districts={districts} wards={wards} setCities={setCities} setDistricts={setDistricts} setWards={setWards} />}
            {noti && <Toast showed={noti} message={notiMessage} setNoti={setNoti} />}
            <div>
                {(page == 'list') && <Widget resizable={true} style={{ width: '200px', }}
                    handleNewUserMessage={handleNewUserMessage}
                    handleQuickButtonClicked={handleQuickButtonClicked}
                    // profileAvatar={'text'}
                    title="Webnhatro"
                    subtitle="Hỗ trợ tìm kiếm"
                />}
            </div>
            <Footer />
        </Fragment>
    )
}