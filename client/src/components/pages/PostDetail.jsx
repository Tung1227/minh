import { Fragment, useEffect, useRef, useState } from "react";
import { Carousel } from "@material-tailwind/react";
import ReportModal from "./ReportModal";

export default function PostDetail(props) {
  const { post, user, address } = { ...props.post }
  const [modal, setModal] = useState(false);
  useEffect(() => {
  }, [props.post])

  const acceptPost = async (post_id) => {
    try {
      const url = await `${process.env.REACT_APP_API_URL}/admin/acceptpost`
      const respone = await fetch(url, {
        method: "post",
        headers: { "content-Type": "application/json", token: localStorage.getItem("token") },
        body: JSON.stringify({ post_id: post_id })
      })
      const data = await respone.json()
      props.setPage(props.from)
    } catch (error) {
      console.log(error.message)
    }
  }


  const rejectPost = async (post_id) => {
    try {
      const url = await `${process.env.REACT_APP_API_URL}/admin/rejectpost`
      const respone = await fetch(url, {
        method: "post",
        headers: { "content-type": "application/json", token: localStorage.getItem("token") },
        body: JSON.stringify({ post_id: post_id })
      })
      const data = await respone.json()
      props.setPage(props.from)
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <Fragment>
      {<ReportModal modal={modal} setModal={setModal} post_id={post.post_id} setNoti={props.setNoti} setNotiMessage={props.setNotiMessage} />}
      <div className="container">
        <Carousel className="rounded-xl" style={{ borderColor: 'rgb(203 213 225)' }}>
          {post.detail_post[0].image_file.map((image, index) => (
            <img key={index} style={{ height: '700px' }}
              src={`${process.env.REACT_APP_MEDIA_URL}${image}`}
              alt="image 1"
              className="h-full w-full object-cover h-30"
            />
          ))}
          <img style={{ height: '700px' }}
            src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80"
            alt="image 1"
            className="h-full w-full object-cover"
          />
          <img style={{ height: '700px' }}
            src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"
            alt="image 2"
            className="h-full w-full object-cover"
          />
          <img style={{ height: '700px' }}
            src="https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80"
            alt="image 3"
            className="h-full w-full object-cover"
          />
        </Carousel>
        <div className="text-left">
          <div className="flex justify-between">
            <h1 className="font-bold text-xl">{post.title}</h1>
            <h1 className="">Được tạo bởi {user.user_name}</h1>
          </div>
          <div className="flex justify-between">
            <h1 ><span className="font-bold ">Giá:</span> {post.detail_post[0].price}</h1>
            {props.logined && (props.userinfo.account_type == 'admin') && (props.from == 'post' || props.from == 'update') && <div>
              <button type="" className="btn btn-primary" onClick={() => { acceptPost(post.post_id) }}>chấp nhận</button>
              <button type="" className="btn btn-secondary" onClick={() => { rejectPost(post.post_id) }}>từ chối</button>
            </div>}
          </div>
          <h1 ><span className="font-bold ">Mô tả:</span> {post.detail_post[0].content}</h1>
          <h1 ><span className="font-bold ">Giá điện:</span> {post.detail_post[0].electric_price}</h1>
          <h1 ><span className="font-bold ">Giá nước:</span> {post.detail_post[0].water_price}</h1>
          <h1 ><span className="font-bold ">Điều hoà:</span> {post.detail_post[0].air_condition ? 'Có' : 'không'}</h1>
          <h1 ><span className="font-bold ">Máy giặt:</span> {post.detail_post[0].washing ? 'Có' : 'không'}</h1>
          <div className="flex justify-between">
            <h1 ><span className="font-bold ">Liên hệ:</span> {user.userinfo[0].phone_number}</h1>
            {props.logined && (props.userinfo.account_type == 'user') && <svg onClick={() => {
              setModal(true)
            }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
            </svg>}
          </div>
          <h1 ><span className="font-bold ">Địa chỉ:</span> {post.detail_post[0].address}, {address.districts[0].wards[0].name}, {address.districts[0].name}, {address.name}</h1>
        </div>
      </div>
    </Fragment>
  );
}
