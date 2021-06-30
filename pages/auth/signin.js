import { csrfToken } from 'next-auth/client'

import Head from 'next/head'
import Header from '../../components/Header'

import { useIntl } from 'react-intl'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { FaSpinner } from 'react-icons/fa'
import Link from 'next/link'
import Footer from '../../components/Footer'

export default function SignIn ({ csrfToken }) {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [loading, setLoading] = useState(false)

  const { NEXT_PUBLIC_URL } = process.env
  const router = useRouter()

  const handleSubmit = () => {
    setLoading(true)
  }

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='bg-dial-gray-dark pt-40' style={{ minHeight: '70vh' }}>
        <div id='content' className='px-4 sm:px-0 max-w-full sm:max-w-prose mx-auto container-fluid with-header'>
          <form method='post' onSubmit={handleSubmit} action={`/api/auth/callback/credentials?callbackUrl=${NEXT_PUBLIC_URL}/${router.locale}/`}>
            <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
            <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col'>
              <div className='mb-4'>
                <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='username'>
                  {format('signIn.email')}
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                  id='username' name='username' type='text' placeholder={format('signIn.email.placeholder')}
                />
              </div>
              <div className='mb-6'>
                <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='password'>
                  {format('signIn.password')}
                </label>
                <input
                  className='shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3'
                  id='password' name='password' type='password' placeholder='******************'
                />
                <p className='text-red text-xs italic'>{format('signIn.password.hint')}</p>
              </div>
              <div className='flex items-center justify-between text-sm font-semibold'>
                <button
                  className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                  type='submit' disabled={loading}
                >
                  {format('app.signIn')}
                  {loading && <FaSpinner className='spinner ml-3' />}
                </button>
                <div>
                  <Link href='/auth/signup'>
                    <a className='inline-block align-baseline border-b-2 border-transparent hover:border-dial-yellow' href='/auth/signup'>
                      {format('app.signUp')}
                    </a>
                  </Link>
                  <span className='border-r-2 border-dial-gray-dark mx-2' />
                  <Link href='/auth/resetpassword'>
                    <a className='inline-block align-baseline border-b-2 border-transparent hover:border-dial-yellow' href='/auth/resetpassword'>
                      {format('signIn.forgetPassword')}
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

export async function getServerSideProps (ctx) {
  const { resolvedUrl, query, locale } = ctx

  if (query && query.callbackUrl) {
    const url = new URL(query.callbackUrl)
    const [, cbLang] = url.pathname.split('/')

    if (cbLang && cbLang !== locale) {
      return {
        redirect: {
          destination: `/${cbLang}${resolvedUrl}`
        }
      }
    }
  }
  return {
    props: {
      csrfToken: await csrfToken(ctx)
    }
  }
}
