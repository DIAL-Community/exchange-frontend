import { useState, useEffect } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { FaThumbsUp, FaHeart, FaLightbulb, FaTh } from 'react-icons/fa';
import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'

const DiscourseForum = ({ topicId }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [posts, setPosts] = useState()
  const [showPost, setShowPost] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const [newPost, setNewPost] = useState()
  const [session] = useSession()

  const apiKey = process.env.NEXT_PUBLIC_DISCOURSE_KEY
  const url = 'https://discourse.govstack.global/'

  useEffect(() => {
    const res = fetch(url+'/t/'+topicId+'.json', {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => 
      response.json())
    .then(data => {
      if (data.post_stream && data.post_stream.posts.length > 0) {
        setPosts(data.post_stream.posts)
      }
    })
    .catch((error) => {
      console.error('Error:', error)
    })
  }, [])
  
  const toggleShowPosts = (e) => {
    e.preventDefault()
    setShowPost(current => !current)
  }

  const submitPost = (e) => {
    e.preventDefault()
    const postURL = new URL(process.env.NEXT_PUBLIC_API_URL+'/api/discourse')
    postURL.search = new URLSearchParams({
        topicId: topicId,
        username: session.user.username,
        raw: newPost
    })
    fetch(postURL).then(res => {
      if (res.status == 404) {
        setShowPost(false)
        setShowUser(true)
      } else {
        if (res.status == 200) {
          res.json().then(data => {
            setPosts([...posts, data])
            setShowPost(false)
          })
        }
      }
    })
  }

  return (
    posts ? 
    <div>
      <div className='mb-2'><a href={url+'t/'+topicId} target='_blank' className='py-2 px-2 my-2 h5 text-white bg-dial-teal rounded'>{format('product.discourse')}</a></div>
      {posts && posts.map((post, i) => {
        return (
          <div key={i} className='p-2 text-dial-purple-light border border-dial-gray rounded'>
          {ReactHtmlParser(post.cooked)}
          <div className='text-xs'>
            <div className='mr-5 inline'>Post Date: {new Date(post.created_at).toDateString()}</div>
              <div className='mx-5 inline'>Author: {post.display_username}</div>
                {post.reactions && post.reactions.map((reaction, j) => {
                switch (reaction.id) {
                  case 'thumbsup':
                    return(<div key={j} className='text-xs inline ml-5'><FaThumbsUp className='mr-2 inline' />{reaction.count}</div>)
                  case 'heart':
                    return(<div key={j} className='text-xs inline ml-5'><FaHeart className='mr-2 inline' />{reaction.count}</div>)
                  case 'lightbulb':
                    return(<div key={j} className='text-xs inline ml-5'><FaLightbulb className='mr-2 inline' />{reaction.count}</div>)
                }
              })}
            </div>
          </div>
        )
      })}
      {showPost ? (
        session ? (
          <div className='p-2 text-dial-purple-light border border-dial-gray rounded'>
            <textarea id='postText' placeholder='Write a post' className='w-full p-2' onChange={e => setNewPost(e.target.value)}></textarea>
            <button className='py-1 px-2 h5 text-white bg-dial-teal rounded' onClick={(e) => submitPost(e)}>{format('app.submit')}</button>
          </div>)
          :
          (<div className='p-2 text-dial-purple-light'>{format('product.forum.login')}</div>)
      ) :
        !showUser && (
        <div className='mt-2'>
          <button className='py-1 px-2 h5 text-white bg-dial-teal rounded' onClick={(e) => toggleShowPosts(e)}>{format('product.post')}</button>
        </div>)
      }
      {showUser && (
        <div className='mt-2'>
          <div className='text-dial-purple-light'>{format('product.forum.createAccount')} '{session.user.username}'</div>
          <a href={`${url}/signup`} target='_blank' className='py-1 px-2 h5 text-white bg-dial-teal rounded'>Sign Up</a>
        </div>
      )}
    </div>
    :
    <div className='text-sm'>{format('product.noforum')}</div>
  );
}

export default DiscourseForum
