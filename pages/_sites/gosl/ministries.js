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
          Ministries
        </div>
        <div className='w-full text-dial-blue text-xl p-12'>
          <a href='http://mic.gov.sl/'>Ministry of Information and Communication</a>
          <br />
          <br />
          <a href='https://mohs.gov.sl/'>Ministry of Health and Sanitation</a>
          <br />
          <br />
          <a href='https://maf.gov.sl/'>Ministry of Agriculture and Farming</a>
          <br />
          <br />
          <a href='http://mof.gov.sl/'>Ministry of Finance</a>
          <br />
          <br />
          <a href='https://www.dsti.gov.sl/wp-content/uploads/2019/11/Sierra-Leone-National-Innovation-and-Digital-Strategy.pdf'>View the Government of Sierra Leone 10 year digital transformation strategy.</a>
          <br />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AboutPage
