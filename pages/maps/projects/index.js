import Head from 'next/head'
import { useIntl } from 'react-intl'

import apolloClient from '../../../lib/apolloClient'

import Filter from '../../../components/filter/Filter'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ProjectMap from '../../../components/maps/projects/ProjectMap'

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
      <Filter activeTab='filter.entity.maps' />
      <ProjectMap />
      <Footer />
    </>
  )
}

export default apolloClient()(ProjectMapPage)
