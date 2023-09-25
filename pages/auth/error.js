import { getCsrfToken, getSession } from 'next-auth/react'
import Link from 'next/link'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Header from '../../components/shared/Header'

export default function Error () {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <Header isOnAuthPage />
      <div className='bg-dial-gray-dark pt-40 h-screen text-dial-sapphire'>
        <div id='content' className='px-4 sm:px-0 max-w-full sm:max-w-prose mx-auto'>
          <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col'>
            <h1 className='block mb-3 mx-2'>{format('error.auth')}</h1>
            <div className='flex gap-2 items-center text-white font-semibold'>
              <Link href='/auth/signin' className='bg-dial-sapphire py-2 px-4 mx-2 rounded'>
                {format('error.tryAgain')}
              </Link>
              <Link href='/' className='bg-dial-sapphire py-2 px-4 rounded'>
                {format('error.goBack')}
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
