import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import BuildingBlockRibbon from '../../components/building-block/BuildingBlockRibbon'
import BuildingBlockTabNav from '../../components/building-block/BuildingBlockTabNav'
import BuildingBlockMain from '../../components/building-block/BuildingBlockMain'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import { DEFAULT_PAGE_SIZE } from '../../components/utils/constants'
import { BuildingBlockFilterDispatchContext } from '../../components/context/BuildingBlockFilterContext'

const BuildingBlockListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  const { query: { page } } = useRouter()
  const { setPageNumber, setPageOffset } = useContext(BuildingBlockFilterDispatchContext)

  useEffect(() => {
    if (page) {
      setPageNumber(parseInt(page) - 1)
      setPageOffset((parseInt(page) - 1) * DEFAULT_PAGE_SIZE)
    }
  }, [page, setPageNumber, setPageOffset])

  return (
    <>
      <NextSeo
        title={format('ui.buildingBlock.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.buildingBlock.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <BuildingBlockRibbon />
          <BuildingBlockTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <BuildingBlockMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default BuildingBlockListPage
