import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Head from 'next/head'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import NotFound from '../../../components/shared/NotFound'

import withApollo from '../../../lib/apolloClient'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import OrganizationDetailLeft from '../../../components/organizations/OrganizationDetailLeft'
import OrganizationDetailRight from '../../../components/organizations/OrganizationDetailRight'
import { Loading, Error } from '../../../components/shared/FetchStatus'
import { useEffect } from 'react'

const ORGANIZATION_QUERY = gql`
query Organization($slug: String!, $locale: String!) {
  organization(slug: $slug) {
    id
    name
    slug
    isMni
    website
    imageFile
    whenEndorsed
    organizationDescriptions {
      description
      locale
    }
    offices {
      id
      name
      latitude
      longitude
    }
    sectorsWithLocale(locale: $locale) {
      name
      slug
    }
    countries {
      id
      name
      slug
    }
    projects {
      name
      slug
      origin {
        slug
      }
    }
  }
}
`

const Organization = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { pathname, asPath, query } = useRouter()

  const { locale } = router
  const { slug } = router.query
  const { loading, error, data } = useQuery(ORGANIZATION_QUERY, { variables: { slug: slug, locale: locale }, skip: !slug })

  useEffect(() => {
    if (query.locale) {
      router.replace({ pathname }, asPath, { locale: query.locale })
    }
  })
  
  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      {loading && <Loading />}
      {error && error.networkError && <Error />}
      {error && !error.networkError && <NotFound />}
      {
        data && data.organization &&
          <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <OrganizationDetailLeft organization={data.organization} />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <OrganizationDetailRight organization={data.organization} />
            </div>
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(Organization)
