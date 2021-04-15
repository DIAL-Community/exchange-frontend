import Head from 'next/head'
import { useIntl } from 'react-intl'

import apolloClient from '../../lib/apolloClient'

import Filter from '../../components/filter/Filter'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import OrganizationListQuery from '../../components/organizations/OrganizationList'

const Organizations = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <Filter activeTab='organizations' />
      <OrganizationListQuery />
      <Footer />
    </>
  )
}

export default apolloClient()(Organizations)
