import { Fragment, useEffect, useMemo, useState } from "react";
import Pagination from "../pagination/Pagination";


let PageSize = 12

export default function Listpost(props) {

    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState([]);
    const posts = props.posts



    // const currentTableData = (() => {
    //     const firstPageIndex = (currentPage - 1) * PageSize;
    //     const lastPageIndex = firstPageIndex + PageSize;
    //     setData(posts.slice(firstPageIndex, lastPageIndex))
    //     return posts.slice(firstPageIndex, lastPageIndex);
    // }, [currentPage]);

    useEffect(() => {
        console.log(posts)
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        setData(posts.slice(firstPageIndex, lastPageIndex))
    }, [posts, currentPage])

    const getAllPost = async () => {
        const url = await `${process.env.REACT_APP_API_URL}/post/allpost`
        const respone = await fetch(url, {
            method: 'GET',
            headers: { token: localStorage.token }
        })

        const parseRes = await respone.json()
        if (parseRes.message) {
            props.setNoti('red')
            props.setNotiMessage(parseRes.message)
            setTimeout(() => {
                props.setNoti('')
            }, 3000);
            props.setPosts([])
        } else {
            props.setPosts(parseRes.result)
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
            return parseRes.post
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        console.log(props.from)
        if (props.from != 'list') {
            getAllPost()
        }
    }, []);

    const onClick = (post) => {
        props.setFrom('list')
        props.setPagearr(['Chi tiết'])
        getPost(post).then(() => {
            props.setPage('Chi tiết')
        })
    }
    return (
        <Fragment>
            {data.length == 0 && <div style={{ minHeight: '836px' }}>Không tìm thấy tin phù hợp</div>}
            {data.length != 0 && <div style={{ minHeight: '836px' }} className="bg-white text-center">
                <div className="mx-auto max-w-2xl px-4 py-4 md:px-6 md:py-23 lg:max-w-7xl lg:px-8">
                    <h2 className="sr-only">Post</h2>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {data.map((post) => (
                            <a key={post.post_id} id={post.post_id} className="group" onClick={() => { onClick(post.post_id) }}>
                                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                    <img
                                        src={process.env.REACT_APP_MEDIA_URL + post.detail_post[0].image_file[0]}
                                        alt={post.title}
                                        className="h-40 w-80 object-cover object-center group-hover:opacity-75"
                                    />
                                </div>
                                <h3 className="mt-4 text-sm text-gray-700">{post.title}</h3>
                                <p className="mt-1 text-lg font-medium text-gray-900">
                                    {post.detail_post[0].price}
                                </p>
                            </a>
                        ))}
                    </div>
                </div>
            </div>}
            <div className="container pl-5">
                {posts && <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={posts.length}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                />}
            </div>
        </Fragment>
    )
}