import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Header from '../../../components/shared/Header'
import ClientOnly from '../../../lib/ClientOnly'
import Footer from '../../../components/shared/Footer'
import MapContainer from '../../../components/maps/MapContainer'

const ProjectMapPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('map.header')}
        description={format('seo.description.maps')}
      />
      <Header />
      <ClientOnly>
        <MapContainer />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default ProjectMapPage
