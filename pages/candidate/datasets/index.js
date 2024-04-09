import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../../lib/ClientOnly'
import QueryNotification from '../../../components/shared/QueryNotification'
import Header from '../../../components/shared/Header'
import Footer from '../../../components/shared/Footer'
import DatasetRibbon from '../../../components/candidate/dataset/DatasetRibbon'
import DatasetTabNav from '../../../components/candidate/dataset/DatasetTabNav'
import DatasetMain from '../../../components/candidate/dataset/DatasetMain'

const DatasetListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.candidateDataset.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.candidateDataset.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenant='default'>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <DatasetRibbon />
          <DatasetTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <DatasetMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default DatasetListPage
