import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import Header from '../../../components/shared/Header'
import ClientOnly from '../../../lib/ClientOnly'
import Footer from '../../../components/shared/Footer'
import MapContainer from '../../../components/maps/MapContainer'

const EndorserMapPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('map.header')}
        description={format('seo.description.maps')}
      />
      <Header />
      <ClientOnly clientTenants={defaultTenants}>
        <MapContainer />
      </ClientOnly>
      <Footer />
    </>
  )
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { defaultTenants } = await response.json()

  // Passing data to the page as props
  return { props: { defaultTenants } }
}

export default EndorserMapPage
