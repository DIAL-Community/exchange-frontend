import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import HealthBody from '../../components/health/sections/HealthBody'
import HealthFooter from '../../components/health/sections/HealthFooter'
import HealthHeader from '../../components/health/sections/HealthHeader'
import HealthProducts from '../../components/health/sections/HealthProducts'
import QueryNotification from '../../components/shared/QueryNotification'
import ClientOnly from '../../lib/ClientOnly'

const HealthPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('health.title')}
        description={format('seo.health.description.about')}
      />
      <ClientOnly clientTenants={defaultTenants}>
        <QueryNotification />
        <HealthHeader />
        <HealthBody />
        <HealthProducts onlyFeatured={true}/>
        <div className='text-2xl leading-tight font-bold py-3 pl-8 text-health-blue px-4 lg:px-8 xl:px-48 pb-8'>
          To apply for inclusion in the HealthTech Marketplace, please fill out <a className='text-health-green'
            href='https://forms.gle/5fJkSUPSQ3WSaT4U9' target='_blank' rel='noreferrer'>this form</a>
        </div>
        <HealthFooter />
      </ClientOnly>
    </>
  )
}

export default HealthPage
