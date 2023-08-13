import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import Header from '../../../../../ui/v1/shared/Header'
import ClientOnly from '../../../../../lib/ClientOnly'
import Footer from '../../../../../ui/v1/shared/Footer'
import CityCreate from '../../../../../ui/v1/city/CityCreate'

const CreateCityPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('ui.city.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.city.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <CityCreate />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default CreateCityPage
