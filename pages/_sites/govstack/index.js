import Head from 'next/head'
import { useIntl } from 'react-intl'
import Image from 'next/image'
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
      <Landing />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <div className='p-24'>
        <div className='inline-block p-8 bg-blue-900 text-3xl text-bold text-white'>Context and Challenge</div>
        <div className='w-full py-4 pl-16 flex'>
          <Image src='/images/govstack/govstack1.webp' alt='Govstack Image' width={500} height={300} />
          <div className='ml-5 w-1/3 pt-8'>
            Digital government services are vital for fostering economic growth, developing the digital economy and promoting trust in government institutions.  
            <br /><br />
            Governments struggle to keep pace with the digitalization trend due to budget constraints, the coordination between agencies and siloed investments in digitization.
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default HomePage
