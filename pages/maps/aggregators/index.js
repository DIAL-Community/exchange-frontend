import Head from 'next/head'
import { useIntl } from 'react-intl'
import apolloClient from '../../../lib/apolloClient'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

import AggregatorMap from '../../../components/maps/aggregators/AggregatorMap'
import PageContent from '../../../components/main/PageContent'
import TabNav from '../../../components/main/TabNav'
import MobileNav from '../../../components/main/MobileNav'

import MapFilter from '../../../components/maps/MapFilter'
import MapActiveFilter from '../../../components/maps/MapActiveFilter'

const ProjectMapPage = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <TabNav activeTab='filter.entity.maps' />
      <MobileNav activeTab='filter.entity.maps' />
      <PageContent
        activeTab='filter.entity.maps'
        filter={<MapFilter />}
        content={<AggregatorMap />}
        activeFilter={<MapActiveFilter />}
      />
      <Footer />
    </>
  )
}

export default apolloClient()(ProjectMapPage)
