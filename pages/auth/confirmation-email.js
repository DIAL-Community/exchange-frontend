import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import dynamic from 'next/dynamic'
import { getCsrfToken, getSession } from 'next-auth/react'
import Header from '../../ui/v1/shared/Header'
import Footer from '../../ui/v1/shared/Footer'
import { ToastContext } from '../../lib/ToastContext'
const Tooltip = dynamic(() => import('react-tooltip').then(x => x.Tooltip), { ssr: false })

const ConfirmationEmail = () => {
  const router = useRouter()

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const { showToast } = useContext(ToastContext)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    const response = await fetch(process.env.NEXT_PUBLIC_AUTH_SERVER + '/auth/resend-activation-email', {
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

    setLoading(false)
    if (response.status === 200) {
      setEmail('')
      showToast(
        format('toast.confirmation.email.success'),
        'success',
        'top-center',
        3000,
        null,
        () => router.push('/auth/signin')
      )
    }
  }

  return (
    <>
      <Header isOnAuthPage />
      <Tooltip className='tooltip-prose bg-gray-300 text-gray rounded' />
      <div className='bg-dial-gray-dark pt-28 max-w-catalog mx-auto min-h-[70vh]'>
        <div className='pt-4 text-dial-sapphire'>
          <div id='content' className='px-4 sm:px-0 max-w-full sm:max-w-prose mx-auto'>
            <form method='post' onSubmit={handleSubmit}>
              <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <label className='block text-grey-darker text-sm font-bold' htmlFor='email'>
                    {format('confirmation.email')}
                  </label>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    placeholder={format('confirmation.email.placeholder')}
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className='flex items-center justify-between font-semibold text-sm'>
                  <div className='flex'>
                    <button
                      className='bg-dial-sapphire text-white py-2 px-4 rounded flex disabled:opacity-50'
                      type='submit'
                      disabled={loading}
                    >
                      {format('confirmation.request')}
                      {loading && <FaSpinner className='spinner ml-3 my-auto' />}
                    </button>
                  </div>
                  <div className='flex gap-2'>
                    <Link
                      href='/auth/signin'
                      className='border-b-2 border-transparent hover:border-dial-sunshine'
                    >
                      {format('app.signIn')}
                    </Link>
                    <div className='border-r-2 border-dial-gray-dark' />
                    <Link
                      href='/auth/signup'
                      className='border-b-2 border-transparent hover:border-dial-sunshine'
                    >
                      {format('app.signUp')}
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

export default ConfirmationEmail

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
