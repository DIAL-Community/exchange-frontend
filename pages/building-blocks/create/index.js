import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import Header from '../../../components/shared/Header'
import ClientOnly from '../../../lib/ClientOnly'
import Footer from '../../../components/shared/Footer'
import BuildingBlockCreate from '../../../components/building-block/BuildingBlockCreate'

const CreateBuildingBlockPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
      <ClientOnly clientTenants={['default', 'fao']}>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <BuildingBlockCreate />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default CreateBuildingBlockPage
