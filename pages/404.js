import Head from 'next/head'
import { FaExclamationCircle } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import Footer from '../components/Footer'
import Header from '../components/Header'

const Custom404 = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='grid place-items-center bg-gradient-to-b from-dial-gray-light to-white'>
        <div className='my-20 text-button-gray text-lg'>
          <FaExclamationCircle size='3em' className='w-full mb-5' />
          <div class='font-semibold'>404 - Page Not Found</div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Custom404
