/* global fetch:false */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  const apiKey = req.query.objType === 'prod' ? process.env.NEXT_PUBLIC_DISCOURSE_PROD_KEY : process.env.NEXT_PUBLIC_DISCOURSE_BB_KEY
  const url = req.query.objType === 'prod' ? process.env.NEXT_PUBLIC_DISCOURSE_PROD_URL : process.env.NEXT_PUBLIC_DISCOURSE_BB_URL

  fetch(url + '/u/' + req.query.username, {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Api-Username',
      'Api-Key': apiKey,
      'Api-Username': 'system'
    }
  }).then(userRes => {
    if (userRes.status === 404) {
      return res.status(404).json({})
    }

    const postData = {
      topic_id: req.query.topicId,
      raw: req.query.raw
    }
    fetch(url + '/posts.json', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'Api-Username',
        'Api-Key': apiKey,
        'Api-Username': req.query.username
      },
      body: JSON.stringify(postData)
    }).then(response => response.json()
      .then(data => {
        return res.status(response.status).json(data)
      })
    )
  })
}
