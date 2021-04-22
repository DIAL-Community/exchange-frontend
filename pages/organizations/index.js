import Head from 'next/head'
import { useContext } from 'react'
import { useIntl } from 'react-intl'

import apolloClient from '../../lib/apolloClient'

import Filter from '../../components/filter/Filter'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import OrganizationListQuery from '../../components/organizations/OrganizationList'
import { OrganizationFilterContext, OrganizationFilterDispatchContext } from '../../components/context/OrganizationFilterContext'
import GradientBackground from '../../components/shared/GradientBackground'
import SearchFilter from '../../components/shared/SearchFilter'

const Organizations = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { search, displayType } = useContext(OrganizationFilterContext)
  const { setSearch, setDisplayType } = useContext(OrganizationFilterDispatchContext)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <GradientBackground />
      <Header />
      <Filter activeTab='organizations' />
      <SearchFilter {...{ search, setSearch, displayType, setDisplayType }} placeholder='Search for an Organization' />
      <OrganizationListQuery />
      <Footer />
    </>
  )
}

export default apolloClient()(Organizations)
