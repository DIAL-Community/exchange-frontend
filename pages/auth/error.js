import { getCsrfToken, getSession } from 'next-auth/react'
import Link from 'next/link'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Header from '../../components/Header'

export default function Error () {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <Header />
      <div className='bg-dial-gray-dark pt-40 h-screen'>
        <div id='content' className='px-4 sm:px-0 max-w-full sm:max-w-prose mx-auto'>
          <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col'>
            <h1 className='block mb-3 mx-2'>{format('error.auth')}</h1>
            <div className='flex items-center'>
              <Link href='/auth/signin' passHref>
                <a
                  href='navigate-to-signin'
                  className='bg-dial-gray-dark hover:bg-blue-dark text-dial-gray-light font-bold py-2 px-4 mx-2 rounded'
                >
                  {format('error.tryAgain')}
                </a>
              </Link>
              <Link href='/'>
                <a
                  href='navigate-to-home'
                  className='bg-dial-gray-dark hover:bg-blue-dark text-dial-gray-light font-bold py-2 px-4 mx-2 rounded'
                >
                  {format('error.goBack')}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

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
