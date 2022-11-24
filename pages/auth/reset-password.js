import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import dynamic from 'next/dynamic'
import { getCsrfToken, getSession } from 'next-auth/react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const ResetPassword = () => {
  const router = useRouter()

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    const response = await fetch(process.env.NEXT_PUBLIC_AUTH_SERVER + '/auth/reset-password', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_AUTH_SERVER,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Set-Cookie',
        'X-User-Email': email
      }
    })

    if (response.status === 201) {
      setEmail('')
      setCreated(true)
      setTimeout(() => {
        router.push('/products')
      }, 3000)
    }

    setLoading(false)
  }

  return (
    <>
      <Header isOnAuthPage />
      <ReactTooltip className='tooltip-prose bg-gray-300 text-gray rounded' />
      <div className='bg-dial-gray-dark pt-28 simple-form-height'>
        <div className={`mx-4 ${created ? 'visible' : 'invisible'} text-center bg-dial-gray-dark`}>
          <div className='my-auto text-emerald-500'>{format('reset.created')}</div>
        </div>
        <div className='pt-4'>
          <div id='content' className='px-4 sm:px-0 max-w-full sm:max-w-prose mx-auto'>
            <form method='post' onSubmit={handleSubmit}>
              <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col'>
                <div className='mb-4'>
                  <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='email'>
                    {format('reset.email')}
                  </label>
                  <input
                    id='email' name='email' type='email' placeholder={format('reset.email.placeholder')}
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className='flex items-center justify-between font-semibold text-sm mt-2'>
                  <div className='flex'>
                    <button
                      className='bg-dial-gray-dark text-dial-gray-light py-2 px-4 rounded inline-flex items-center disabled:opacity-50'
                      type='submit' disabled={loading}
                    >
                      {format('app.resetPassword')}
                      {loading && <FaSpinner className='spinner ml-3' />}
                    </button>
                  </div>
                  <div className='flex'>
                    <Link href='/auth/signin'>
                      <a
                        className='inline-block align-baseline border-b-2 border-transparent hover:border-dial-yellow'
                        href='navigate-to-signin'
                      >
                        {format('app.signIn')}
                      </a>
                    </Link>
                    <div className='border-r-2 border-dial-gray-dark mx-2' />
                    <Link href='/auth/signup'>
                      <a
                        className='inline-block align-baseline border-b-2 border-transparent hover:border-dial-yellow'
                        href='navigate-to-signup'
                      >
                        {format('app.signUp')}
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ResetPassword

export async function getServerSideProps (ctx) {
  const session = await getSession(ctx)

  if (session) {
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
