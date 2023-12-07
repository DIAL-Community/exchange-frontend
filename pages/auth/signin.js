import { useRouter } from 'next/router'
import { getCsrfToken, getSession } from 'next-auth/react'
import { useIntl } from 'react-intl'
import { useState, useRef, useEffect, useCallback } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import Input from '../../components/shared/form/Input'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'

export default function SignIn ({ csrfToken, tenant }) {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)
  const [requireConfirmation, setRequireConfirmation] = useState(false)
  const [invalidCredentials, setInvalidCredentials] = useState(false)

  const router = useRouter()
  const { query } = router

  useEffect(() => {
    if (query?.error === 'CredentialsSignin') {
      setRequireConfirmation(true)
    }
  }, [query])

  const doLogin = async (data) => {
    setLoading(true)
    setRequireConfirmation(false)
    setInvalidCredentials(false)
    const { username, password } = data
    const payload = {
      username,
      password,
      tenant,
      csrfToken,
      redirect: false
    }
    const res = await signIn('credentials', payload)
    if (!res?.error) {
      router.push(query.callbackUrl)
    } else {
      if (res?.error === 'RequireConfirmation') {
        setRequireConfirmation(true)
      } else if (res?.error === 'InvalidCredentials') {
        setInvalidCredentials(true)
      }

      setLoading(false)
    }
  }

  const { handleSubmit, register } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true
  })

  const formEl = useRef()
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_AUTH_TYPE === 'auth0') {
      formEl.current && formEl.current.submit()
    }
  }, [formEl])

  return (
    <>
      <Header isOnAuthPage />
      <div className='bg-dial-gray-dark pt-40 pb-40 text-dial-sapphire max-w-catalog mx-auto min-h-[70vh]'>
        <div id='content' className='px-4 sm:px-0 max-w-full sm:max-w-prose mx-auto'>
          <form
            ref={formEl}
            method='post'
            onSubmit={handleSubmit(doLogin)}
          >
            {process.env.NEXT_PUBLIC_AUTH_TYPE !== 'auth0' && (
              <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col gap-6'>
                <div className='flex flex-col gap-2'>
                  <label className='block text-sm font-bold' htmlFor='username'>
                    {format('signIn.email')}
                  </label>
                  <Input className='shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker'
                    {...register('username', { required: format('validation.required') })}
                    id='username'
                    placeholder={format('signIn.email.placeholder')}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='block text-sm font-bold' htmlFor='password'>
                    {format('signIn.password')}
                  </label>
                  <Input className='shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker'
                    {...register('password', { required: format('validation.required') })}
                    id='password' type='password' placeholder='******************'
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
                    <Link
                      href='/auth/signup'
                      className='border-b-2 border-transparent hover:border-dial-sunshine'
                    >
                      {format('app.signUp')}
                    </Link>
                    <span className='border-r-2 border-dial-gray-dark' />
                    <Link
                      href='/auth/reset-password'
                      className='border-b-2 border-transparent hover:border-dial-sunshine'
                    >
                      {format('signIn.forgetPassword')}
                    </Link>
                  </div>
                </div>
                {
                  requireConfirmation &&
                  <div className='text-xs text-red-500 flex gap-1 italic'>
                    {format('signIn.confirmation.required')}
                    <Link
                      href='/auth/confirmation-email'
                      className='border-b-2 border-transparent hover:border-dial-sunshine'
                    >
                      {format('signIn.confirmationEmail')}
                    </Link>
                  </div>
                }
                {
                  invalidCredentials &&
                  <div className='text-xs text-red-500 flex gap-1 italic'>
                    {format('signIn.invalidCredentials')}
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
  const { resolvedUrl, query, locale, req } = ctx

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
      csrfToken: await getCsrfToken(ctx),
      tenant: req.headers.host
    }
  }
}
