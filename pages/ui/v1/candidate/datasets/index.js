import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import QueryNotification from '../../../../../components/shared/QueryNotification'
import ClientOnly from '../../../../../lib/ClientOnly'
import Header from '../../../../../ui/v1/shared/Header'
import Footer from '../../../../../ui/v1/shared/Footer'
import DatasetRibbon from '../../../../../ui/v1/candidate/dataset/DatasetRibbon'
import DatasetTabNav from '../../../../../ui/v1/candidate/dataset/DatasetTabNav'
import DatasetMain from '../../../../../ui/v1/candidate/dataset/DatasetMain'

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
            { entities: format('dataset.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
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
