import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Tooltip } from 'react-tooltip'
import Header from '../../../../../ui/v1/shared/Header'
import ClientOnly from '../../../../../lib/ClientOnly'
import Footer from '../../../../../ui/v1/shared/Footer'
import SectorEdit from '../../../../../ui/v1/sector/SectorEdit'

const EditSectorPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale, query: { slug } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('ui.sector.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('sector.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <SectorEdit slug={slug} locale={locale} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default EditSectorPage
