import { getCsrfToken, getSession } from 'next-auth/react'
import { useIntl } from 'react-intl'
import { useState, useRef, useEffect, useCallback } from 'react'
import { FaSpinner } from 'react-icons/fa'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function SignIn ({ csrfToken }) {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)
  const formEl = useRef()

  const handleSubmit = () => {
    setLoading(true)
  }

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_AUTH_TYPE === 'auth0') {
      formEl.current && formEl.current.submit()
    }
  }, [formEl])

  return (
    <>
      <Header isOnAuthPage />
      <div className='bg-dial-gray-dark pt-40 pb-40'>
        <div id='content' className='px-4 sm:px-0 max-w-full sm:max-w-prose mx-auto'>
          <form
            ref={formEl}
            method='post'
            onSubmit={handleSubmit}
            action={
              process.env.NEXT_PUBLIC_AUTH_TYPE === 'auth0'
                ? '/api/auth/signin/auth0'
                : '/api/auth/callback/credentials'
            }
          >
            <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
            {process.env.NEXT_PUBLIC_AUTH_TYPE !== 'auth0' && (
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
                    className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex disabled:opacity-50'
                    type='submit' disabled={loading}
                  >
                    {format('app.signIn')}
                    {loading && <FaSpinner className='spinner ml-3' />}
                  </button>
                  <div>
                    <Link href='/auth/signup'>
                      <a
                        className='inline-block align-baseline border-b-2 border-transparent hover:border-dial-sunshine'
                        href='navigate-to-signup'
                      >
                        {format('app.signUp')}
                      </a>
                    </Link>
                    <span className='border-r-2 border-dial-gray-dark mx-2' />
                    <Link href='/auth/reset-password'>
                      <a
                        className='inline-block align-baseline border-b-2 border-transparent hover:border-dial-sunshine'
                        href='navigate-to-reset'
                      >
                        {format('signIn.forgetPassword')}
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

export async function getServerSideProps (ctx) {
  const { resolvedUrl, query, locale } = ctx

  const session = await getSession(ctx)

  if (query && query.callbackUrl) {
    const callbackUrl = new URL(query.callbackUrl)
    const [, cbLang] = callbackUrl.pathname.split('/')

    if (cbLang && cbLang !== locale && ['en', 'de', 'fr', 'cs', 'pt', 'es', 'sw'].includes(cbLang)) {
      const [path] = resolvedUrl.split('?')

      return {
        redirect: {
          destination: `/${cbLang}${path}?callbackUrl=${callbackUrl}`
        }
      }
    }
  } else if (session) {
    return {
      redirect: {
        destination: '/'
      }
    }
  }

  return {
    props: {
      csrfToken: await getCsrfToken(ctx)
    }
  }
}
