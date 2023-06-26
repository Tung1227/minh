import { Fragment, useEffect, useState } from "react";
// import postDetail from "./postDetail";

export default function Listpost(props) {
    const posts = props.posts

    const getAllPost = async () => {
        const url = await `${process.env.REACT_APP_API_URL}/post/allpost`
        const respone = await fetch(url, {
            method: 'GET',
            headers: { token: localStorage.token }
        })

        const parseRes = await respone.json()
        props.setPosts(parseRes.result)
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
        getAllPost()
    }, []);

    const onClick = (post) => {
        props.setPagearr(['detail'])
        getPost(post).then(() => {
            props.setPage('detail')
        })
    }
    return (
        <Fragment>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-4 md:px-6 md:py-23 lg:max-w-7xl lg:px-8">
                    <h2 className="sr-only">Post</h2>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {posts.map((post) => (
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
            </div>
        </Fragment>
    )
}