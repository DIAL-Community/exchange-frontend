import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useContext } from 'react'
import dynamic from 'next/dynamic'
import Header from './components/Header'
import Landing from './components/Landing'
import Footer from './components/Footer'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const HomePage = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      Blog Here!
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      
      <Footer />
    </>
  )
}

export default HomePage
