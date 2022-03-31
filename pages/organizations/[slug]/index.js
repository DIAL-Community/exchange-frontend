
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { gql, useQuery } from '@apollo/client'
import { useEffect } from 'react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import withApollo from '../../../lib/apolloClient'
import OrganizationDetail from '../../../components/organizations/OrganizationDetail'

const Organization = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const router = useRouter()
  const { locale, query } = router
  const { slug } = query

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <OrganizationDetail slug={slug} locale={locale} />
      <Footer />
    </>
  )
}

export default withApollo()(Organization)
