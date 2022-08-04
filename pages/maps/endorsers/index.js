import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import EndorserMap from '../../../components/maps/endorsers/EndorserMap'
import TabNav from '../../../components/main/TabNav'
import PageContent from '../../../components/main/PageContent'
import MobileNav from '../../../components/main/MobileNav'
import MapFilter from '../../../components/maps/MapFilter'
import MapActiveFilter from '../../../components/maps/MapActiveFilter'
import ClientOnly from '../../../lib/ClientOnly'

const EndorserMapPage = () => (
  <>
    <Header />
    <TabNav activeTab='filter.entity.maps' />
    <MobileNav activeTab='filter.entity.maps' />
    <ClientOnly>
      <PageContent
        activeTab='filter.entity.maps'
        filter={<MapFilter />}
        content={<EndorserMap />}
        activeFilter={<MapActiveFilter />}
      />
    </ClientOnly>
    <Footer />
  </>
)

export default EndorserMapPage
