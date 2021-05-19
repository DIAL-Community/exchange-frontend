import { csrfToken } from 'next-auth/client'

import Head from 'next/head'
import Header from '../../components/Header'

import { useIntl } from 'react-intl'

export default function SignIn({ csrfToken }) {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='bg-dial-gray-dark pt-40 h-screen'>
        <div id='content' className='px-4 sm:px-0 max-w-full sm:max-w-prose mx-auto container-fluid with-header'>
          <form method='post' action='/api/auth/callback/credentials'>
            <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
            <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col'>
              <div className='mb-4'>
                <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='username'>
                  Username
                </label>
                <input className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker' id='username' name='username' type='text' placeholder='Username' />
              </div>
              <div className='mb-6'>
                <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='password'>
                  Password
                </label>
                <input className='shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3' id='password' name='password' type='password' placeholder='******************' />
                <p className='text-red text-xs italic'>Please choose a password.</p>
              </div>
              <div className='flex items-center justify-between'>
                <button className='bg-dial-gray-dark hover:bg-blue-dark text-dial-gray-light font-bold py-2 px-4 rounded' type='submit'>
                  Sign In
                </button>
                <a className='inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker' href='#'>
                  Forgot Password?
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

SignIn.getInitialProps = async (context) => {
  return {
    csrfToken: await csrfToken(context)
  }
}
