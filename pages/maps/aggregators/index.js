import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import Header from '../../../ui/v1/shared/Header'
import ClientOnly from '../../../lib/ClientOnly'
import Footer from '../../../ui/v1/shared/Footer'
import MapContainer from '../../../ui/v1/maps/MapContainer'

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
