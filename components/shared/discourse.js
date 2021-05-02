import { useState, useEffect } from 'react';

const DiscourseForum = ({ topicId }) => {
  const [posts, setPosts] = useState();
  const apiKey = process.env.NEXT_PUBLIC_DISCOURSE_KEY
  useEffect(() => {
    const res = fetch(`https://discourse.govstack.global/t/`+topicId+`.json`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => 
      response.json())
    .then(data => {
      console.log('Success:', data);
      if (data.post_stream.posts.length > 0) {
        setPosts(data.post_stream.posts)
      }
    })
    .catch((error) => {
      console.error('Error:', error)
    })
  }, [])
  
  

  return (
    <div>
      {posts && posts.map((post) => {
        console.log(post)
        return (
          post.cooked
        )
      })}
      
    </div>
  );
}

export default DiscourseForum
