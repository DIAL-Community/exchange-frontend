/* eslint-disable max-len */
import Head from 'next/head'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import Header from './components/Header'
import Footer from './components/Footer'

const AboutPage = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='container py-6'>
        <div className='w-[14rem] p-3 text-4xl bg-blue-900 text-white'>
          Procurement resources
        </div>
        <div className='p-4 text-dial-blue'>
          <a href='http://demo.dial.community:8090/' target='_blank' rel='noreferrer'>Click here to see a list of open RFPs for various ministries</a>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AboutPage
