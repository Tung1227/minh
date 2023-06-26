
import { Fragment } from "react"
import { useState, useEffect } from "react";

export default function ListPost(props) {
  const [posts, setPosts] = useState([]);


  const getAllPost = async () => {
    const url = await `${process.env.REACT_APP_API_URL}/admin/listpost`
    const respone = await fetch(url, {
      method: 'GET',
      headers: { token: localStorage.token }
    })

    const parseRes = await respone.json()
    console.log(parseRes)
    setPosts(parseRes.inacceptPost)
  }

  const getAllUpdatedPost = async () => {
    const url = await `${process.env.REACT_APP_API_URL}/admin/updatedpost`
    const respone = await fetch(url, {
      method: 'GET',
      headers: { token: localStorage.token }
    })

    const parseRes = await respone.json()
    console.log(parseRes)
    setPosts(parseRes.inacceptPost)
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
    console.log(props.from, "from")
    if (props.from == 'post') {
      getAllPost()
    }
    else if (props.from == 'update') {
      getAllUpdatedPost()
    }
  }, [props.from]);

  const onClick = (post) => {
    props.setPagearr(['detail'])
    getPost(post).then(() => {
      props.setPage('detail')
    })
  }

  return (
    <Fragment>
      <table className="border-collapse border border-slate-400 table-auto w-full mt-3">
        <thead>
          <tr>
            <th className="border border-slate-300 ...">STT</th>
            <th className="border border-slate-300 ...">Title</th>
            <th className="border border-slate-300 ...">Date</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={index}>
              <td className="border border-slate-300 ...">{index}</td>
              <td className="border border-slate-300 ..." style={{ color: 'blue' }} onClick={() => { onClick(post.post_id) }}>{post.title}</td>
              <td className="border border-slate-300 ...">{post.create_on}</td>
            </tr>
          ))}

        </tbody>
      </table>
    </Fragment>
  )
}