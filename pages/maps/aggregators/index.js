import Head from 'next/head'
import { useIntl } from 'react-intl'
import apolloClient from '../../../lib/apolloClient'

import Filter from '../../../components/filter/Filter'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

import AggregatorMap from '../../../components/maps/aggregators/AggregatorMap'

const ProjectMapPage = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <Filter activeTab='filter.entity.maps' />
      <AggregatorMap />
      <Footer />
    </>
  )
}

export default apolloClient()(ProjectMapPage)
