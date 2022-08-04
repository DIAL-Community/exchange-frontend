import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ProjectMap from '../../../components/maps/projects/ProjectMap'
import TabNav from '../../../components/main/TabNav'
import PageContent from '../../../components/main/PageContent'
import MobileNav from '../../../components/main/MobileNav'
import MapFilter from '../../../components/maps/MapFilter'
import MapActiveFilter from '../../../components/maps/MapActiveFilter'
import ClientOnly from '../../../lib/ClientOnly'

const ProjectMapPage = () => (
  <>
    <Header />
    <TabNav activeTab='filter.entity.maps' />
    <MobileNav activeTab='filter.entity.maps' />
    <ClientOnly>
      <PageContent
        activeTab='filter.entity.maps'
        filter={<MapFilter />}
        content={<ProjectMap />}
        activeFilter={<MapActiveFilter />}
      />
    </ClientOnly>
    <Footer />
  </>
)

export default ProjectMapPage
