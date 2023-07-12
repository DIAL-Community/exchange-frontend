import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Auth0Provider from 'next-auth/providers/auth0'

// Session expiration in millis
const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000

export default NextAuth({
  secret: process.env.SECRET,
  // Configure one or more authentication providers
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_ISSUER_BASE_URL
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        const authBody = {
          user: {
            email: credentials.username,
            password: credentials.password
          }
        }

        const response = await fetch(
          process.env.NEXT_PUBLIC_AUTH_SERVER + '/authenticate/credentials',
          {
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
            // referrerPolicy: 'no-referrer',
            //   no-referrer,
            //   *no-referrer-when-downgrade,
            //   origin,
            //   origin-when-cross-origin,
            //   same-origin,
            //   strict-origin,
            //   strict-origin-when-cross-origin,
            //   unsafe-url
            body: JSON.stringify(authBody) // body data type must match "Content-Type" header
          }
        )
        if (response.status === 200) {
          // 200: User is good, confirmed.
          return response.json()
        } else if (response.status === 403) {
          // 304: User is good, unconfirmed.
          return null
        } else {
          return new Error('Unable to authenticate')
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      //  "user" parameter is the object received from "authorize"
      //  "token" is being send below to "session" callback...
      //  ...so we set "user" param of "token" to object from "authorize"...
      //  ...and return it...
      user && (token.user = user)
      if (!token.expiration) {
        token.expired = false
        token.expiration = Date.now() + TOKEN_EXPIRATION
      }

      return token
    },
    session: async ({ session, token }) => {
      //  "session" is current session object
      //  below we set "user" param of "session" to value received from "jwt" callback
      session.user = token.user

      if (token.expiration && Date.now() < token.expiration) {
        return session
      } else {
        if (!token.expired) {
          const response = await fetch(process.env.NEXT_PUBLIC_AUTH_SERVER + '/auth/invalidate', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'X-User-Email': session.user.userEmail,
              'X-User-Token': session.user.userToken
            }
          })

          if (response.status === 200) {
            token.expired = true
          }
        }

        return {}
      }
    },
    signIn: async({ user }) => {
      return !(user instanceof Error)
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  events: {
    async signOut ({ token }) {
      const response = await fetch(
        process.env.NEXT_PUBLIC_AUTH_SERVER + '/auth/invalidate',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Email': token.user.userEmail,
            'X-User-Token': token.user.userToken
          }
        }
      )

      if (response.status === 200) {
        console.log(`(Auth) User '${token.user.userEmail}' session's signed out successfully.`)
      }
    }
  }
})
