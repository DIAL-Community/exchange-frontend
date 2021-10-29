import Head from 'next/head'
import { useContext } from 'react'
import { useIntl } from 'react-intl'

import apolloClient from '../../../lib/apolloClient'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import QueryNotification from '../../../components/shared/QueryNotification'
import GradientBackground from '../../../components/shared/GradientBackground'
import { OrganizationFilterContext, OrganizationFilterDispatchContext } from '../../../components/context/candidate/OrganizationFilterContext'
import SearchFilter from '../../../components/shared/SearchFilter'

import dynamic from 'next/dynamic'
const OrganizationListQuery = dynamic(() => import('../../../components/candidate/organizations/OrganizationList'), { ssr: false })

const Organizations = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { search } = useContext(OrganizationFilterContext)
  const { setSearch } = useContext(OrganizationFilterDispatchContext)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <SearchFilter {...{ search, setSearch }} placeholder={`${format('app.search')}${format('candidateOrganization.label')}`} />
      <OrganizationListQuery />
      <Footer />
    </>
  )
}

export default apolloClient()(Organizations)
