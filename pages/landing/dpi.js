import { useIntl } from 'react-intl'
import { NextSeo } from 'next-seo'
import ClientOnly from '../../lib/ClientOnly'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import QueryNotification from '../../components/shared/QueryNotification'

const DpiPage = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <>
      <NextSeo
        title={format('app.title')}
        description={format('seo.description.about')}
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <div className='flex flex-col'>
          <div className='xl:min-h-screen'>
            <div className="max-w-catalog mx-auto image-block-hack image-h-full-hack relative">
              <img className='w-screen h-3/4' height='500' src="images/gdpir/hero.png" alt='GDPIR Hero Image.' />
              <img className='absolute left-20 bottom-40' width='500' height='500' src="images/gdpir/g20.png" alt='G20 Logo' />
              <div className='absolute text-3xl font-bold text-dial-gray-dark top-20 left-20'>
                Tracking the<br /><br />Development and Use<br /><br />of Digital Public Infrastructure<br /><br />around the world
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default DpiPage
