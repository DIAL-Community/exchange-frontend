import Link from 'next/link'
import Header from '../../components/Header'

import Head from 'next/head'

import { useIntl } from 'react-intl'

export default function Error ({ csrfToken }) {
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
          <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col'>
            <h1 className='block mb-3 mx-2'>{format('error.auth')}</h1>
            <div className='flex items-center'>
              <Link href='/auth/signin'>
                <button className='bg-dial-gray-dark hover:bg-blue-dark text-dial-gray-light font-bold py-2 px-4 mx-2 rounded'>
                  {format('error.tryAgain')}
                </button>
              </Link>
              <Link href='/'>
                <button className='bg-dial-gray-dark hover:bg-blue-dark text-dial-gray-light font-bold py-2 px-4 mx-2 rounded'>
                  {format('error.goBack')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
