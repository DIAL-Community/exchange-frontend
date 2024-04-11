import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import Footer from '../../../components/shared/Footer'
import Header from '../../../components/shared/Header'
import SyncTenants from '../../../components/sync/live/SyncTenants'
import ClientOnly from '../../../lib/ClientOnly'

const SyncPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('ui.syncTenant.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.syncTenant.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={['default', 'fao']}>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='lg:px-8 xl:px-56 flex flex-col'>
          <SyncTenants />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default SyncPage
