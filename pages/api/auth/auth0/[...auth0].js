/* Original file used to configure auth0 - now using auth0 plugin for next-auth

import { handleAuth, handleCallback } from '@auth0/nextjs-auth0'

const afterCallback = async (req, res, session, state) => {
  // user is located in session
  // Call the Rails app and 'log in' there to get the token
  const authBody = {
    user: {
      email: session.user.name
    }
  }

  const response = await fetch(process.env.NEXT_PUBLIC_AUTH_SERVER + '/authenticate/auth0', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_AUTH_SERVER,
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Set-Cookie'
      // 'X-CSRF-Token': token //document.querySelector('meta[name="csrf-token"]').attr('content')
    },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(authBody) // body data type must match "Content-Type" header
  })

  const railsUser = await response.json()

  session = { ...session, user: {...session.user, userEmail: railsUser.userEmail, userToken: railsUser.userToken, own: railsUser.own, canEdit: railsUser.canEdit, roles: railsUser.roles}}
  return session
}

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback });
    } catch (err) {
        res.status(err.status ?? 500).end(err.message)
    }
  }
}) */
