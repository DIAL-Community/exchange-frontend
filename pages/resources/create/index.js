import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import ResourceCreate from '../../../components/resources/ResourceCreate'
import Footer from '../../../components/resources/ResourceFooter'
import Header from '../../../components/resources/ResourceHeader'
import ClientOnly from '../../../lib/ClientOnly'

const CreateResourcePage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('ui.resource.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.resource.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenant='default'>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <ResourceCreate />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default CreateResourcePage
