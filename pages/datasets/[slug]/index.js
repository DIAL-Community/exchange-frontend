import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Tooltip } from 'react-tooltip'
import Header from '../../../components/shared/Header'
import ClientOnly from '../../../lib/ClientOnly'
import Footer from '../../../components/shared/Footer'
import DatasetDetail from '../../../components/dataset/DatasetDetail'

const DatasetPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query: { slug } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('ui.dataset.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.dataset.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenant='default'>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <DatasetDetail slug={slug} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default DatasetPage
