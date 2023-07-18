import Head from 'next/head'
import { useIntl } from 'react-intl'
import Header from './components/Header'
import Landing from './components/Landing'
import Footer from './components/Footer'

const HomePage = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className="max-w-catalog mx-auto image-block-hack image-h-full-hack relative">
        <img className='w-screen h-3/4' height='500' src="images/gdpir/hero.png" alt='GDPIR Hero Image.' />
        <img className='absolute left-20 bottom-40' width='500' height='500' src="images/gdpir/g20.png" alt='G20 Logo' />
        <div className='absolute text-3xl font-bold text-dial-gray-dark top-20 left-20'>
          Tracking the<br /><br />Development and Use<br /><br />of Digital Public Infrastructure<br /><br />around the world
        </div>
      </div>
      <Landing />
      <Footer />
    </>
  )
}

export default HomePage
