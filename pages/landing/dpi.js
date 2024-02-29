import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import DpiFooter from '../../components/dpi/sections/DpiFooter'
import DpiHeader from '../../components/dpi/sections/DpiHeader'
import QueryNotification from '../../components/shared/QueryNotification'
import ClientOnly from '../../lib/ClientOnly'

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
        <DpiHeader />
        <div className='flex flex-col'>
          <div className='xl:min-h-screen'>
            <div className="max-w-catalog mx-auto image-block-hack image-h-full-hack relative">
              <img className='w-screen h-3/4' height='500' src="images/gdpir/hero.png" alt='GDPIR Hero Image.' />
              <img
                className='absolute left-20 bottom-40'
                width='500'
                height='500'
                src="images/gdpir/g20.png"
                alt='G20 Logo'
              />
              <div className='absolute text-3xl font-bold text-dial-gray-dark top-20 left-20'>
                Tracking the<br /><br />
                Development and Use<br /><br />
                of Digital Public Infrastructure<br /><br />
                around the world
              </div>
            </div>
          </div>
        </div>
        <DpiFooter />
      </ClientOnly>
    </>
  )
}

export default DpiPage
