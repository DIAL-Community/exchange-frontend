import { useRouter } from 'next/router'
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
  const [requireConfirmation, setRequireConfirmation] = useState(false)

  const handleSubmit = () => {
    setLoading(true)
  }

  const { query } = useRouter()
  useEffect(() => {
    if (query?.error === 'CredentialsSignin') {
      setRequireConfirmation(true)
    }
  }, [query])

  const formEl = useRef()
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_AUTH_TYPE === 'auth0') {
      formEl.current && formEl.current.submit()
    }
  }, [formEl])

  return (
    <>
      <Header isOnAuthPage />
      <div className='bg-dial-gray-dark pt-40 pb-40 text-dial-sapphire'>
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
              <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col gap-6'>
                <div className='flex flex-col gap-2'>
                  <label className='block text-sm font-bold' htmlFor='username'>
                    {format('signIn.email')}
                  </label>
                  <input
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                    id='username' name='username' type='text' placeholder={format('signIn.email.placeholder')}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='block text-sm font-bold' htmlFor='password'>
                    {format('signIn.password')}
                  </label>
                  <input
                    className='shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker'
                    id='password' name='password' type='password' placeholder='******************'
                  />
                  <p className='text-red text-xs italic'>{format('signIn.password.hint')}</p>
                </div>
                <div className='flex items-center justify-between text-sm font-semibold'>
                  <button
                    className='bg-dial-sapphire text-white py-2 px-4 rounded flex disabled:opacity-50'
                    type='submit' disabled={loading}
                  >
                    {format('app.signIn')}
                    {loading && <FaSpinner className='spinner ml-3 my-auto' />}
                  </button>
                  <div className='ml-auto flex gap-2'>
                    <Link href='/auth/signup'>
                      <a className='border-b-2 border-transparent hover:border-dial-sunshine'>
                        {format('app.signUp')}
                      </a>
                    </Link>
                    <span className='border-r-2 border-dial-gray-dark' />
                    <Link href='/auth/reset-password'>
                      <a className='border-b-2 border-transparent hover:border-dial-sunshine'>
                        {format('signIn.forgetPassword')}
                      </a>
                    </Link>
                  </div>
                </div>
                {
                  requireConfirmation &&
                  <div className='text-xs text-red-500 flex gap-1 italic'>
                    {format('signIn.confirmation.required')}
                    <Link href='/auth/confirmation-email'>
                      <a className='border-b-2 border-transparent hover:border-dial-sunshine'>
                        {format('signIn.confirmationEmail')}
                      </a>
                    </Link>
                  </div>
                }
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
