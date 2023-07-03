import { Fragment, useEffect, useState } from "react";
import Pagination from "../pagination/Pagination";


let PageSize = 12

export default function Listposted(props) {
    const [posteds, setPosteds] = useState([])
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);



    const getAllPost = async () => {
        const url = await `${process.env.REACT_APP_API_URL}/user/allpost`
        const respone = await fetch(url, {
            method: 'GET',
            headers: { token: localStorage.token }
        })

        const parseRes = await respone.json()
        console.log(parseRes)
        if (parseRes.message) {
            props.setNoti('red')
            props.setNotiMessage(parseRes.message)
            setTimeout(() => {
                props.setNoti('')
            }, 3000);
            props.setPosts([])
        } else {
            setPosteds(parseRes.result)
        }
    }

    const getPost = async (post) => {
        try {
            console.log(post);
            const url = await `${process.env.REACT_APP_API_URL}/post/postdetail`
            const respone = await fetch(url, {
                method: 'POST',
                headers: { "content-Type": "application/json" },
                body: JSON.stringify({ post_id: post })
            })

            const parseRes = await respone.json()
            console.log(parseRes);
            props.setPostDetail(parseRes)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getAllPost()
    }, []);
    useEffect(() => {
        console.log(posteds)
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        setData(posteds.slice(firstPageIndex, lastPageIndex))
    }, [posteds, currentPage])

    const onClick = (post) => {
        props.setPagearr(['Chỉnh sửa bài đăng'])
        getPost(post).then(() => {
            props.setPage('Chỉnh sửa bài đăng')
        })
    }

    const Delete = async (post) => {
        try {
            console.log(post);
            const url = await `${process.env.REACT_APP_API_URL}/user/delete`
            const respone = await fetch(url, {
                method: 'POST',
                headers: { "content-Type": "application/json", token: localStorage.token },
                body: JSON.stringify({ post_id: post })
            })

            const parseRes = await respone.json().then(() => getAllPost())
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <Fragment>
            {posteds.length == 0 && <div>Không tìm thấy tin đã đăng</div>}
            {posteds.length > 0 && <div className="bg-white" style={{minHeight: '892px'}}>
                <div className="mx-auto max-w-2xl px-4 py-4 md:px-6 md:py-23 lg:max-w-7xl lg:px-8">
                    <h2 className="sr-only">Post</h2>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {data && data.map((post) => (
                            <a key={post.post_id} id={post.post_id} className="group">
                                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                    <img
                                        src={process.env.REACT_APP_MEDIA_URL + post.detail_post[0].image_file[0]}
                                        alt={post.title}
                                        className="h-40 w-80 object-cover object-center group-hover:opacity-75"
                                    />
                                </div>
                                <div className="inline">
                                    <h3 style={{ display: 'inline-block', marginRight: '10px' }} className="mt-4 text-sm text-gray-700">{post.title}</h3>
                                    <svg onClick={() => { onClick(post.post_id) }} style={{ display: 'inline-block', marginRight: '10px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                    <svg onClick={() => { Delete(post.post_id) }} style={{ display: 'inline-block' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeLidth="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </div>
                                <p className="mt-1 text-lg font-medium text-gray-900">
                                    {post.detail_post[0].price}
                                </p>
                            </a>
                        ))}
                    </div>
                </div>
            </div>}
            {posteds && <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={posteds.length}
                pageSize={PageSize}
                onPageChange={page => setCurrentPage(page)}
            />}
        </Fragment>
    )
}