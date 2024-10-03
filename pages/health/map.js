import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import HealthHeader from '../../components/health/sections/HealthHeader'
import HealthFooter from '../../components/health/sections/HealthFooter'
import ClientOnly from '../../lib/ClientOnly'
import MapContainer from '../../components/health/maps/MapContainer'

const ProjectMapPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('map.header')}
        description={format('seo.description.maps')}
      />
      <HealthHeader />
      <ClientOnly clientTenants={defaultTenants}>
        <MapContainer />
      </ClientOnly>
      <HealthFooter />
    </>
  )
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { defaultTenants } = await response.json()

  // Passing data to the page as props
  return { props: { defaultTenants } }
}

export default ProjectMapPage
