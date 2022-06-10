import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useContext } from 'react'
import dynamic from 'next/dynamic'
import Header from './components/Header'
import Landing from './components/Landing'
import Footer from './components/Footer'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const AboutPage = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
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
