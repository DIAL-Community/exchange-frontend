import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Head from 'next/head'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import NotFound from '../../../components/shared/NotFound'

import withApollo from '../../../lib/apolloClient'
import { gql, useQuery } from '@apollo/client'

import OrganizationDetailLeft from '../../../components/organizations/OrganizationDetailLeft'
import OrganizationDetailRight from '../../../components/organizations/OrganizationDetailRight'
import { Loading, Error } from '../../../components/shared/FetchStatus'
import { useEffect } from 'react'

const ORGANIZATION_QUERY = gql`
query Organization($slug: String!) {
  organization(slug: $slug) {
    id
    name
    slug
    isMni
    website
    imageFile
    whenEndorsed
    endorserLevel
    organizationDescription {
      description
      locale
    }
    offices {
      id
      name
      latitude
      longitude
    }
    sectors {
      name
      slug
    }
    countries {
      id
      name
      slug
    }
    products {
      id
      slug
      name
      imageFile
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
  const format = (id, values) => formatMessage({ id: id }, values)

  const router = useRouter()
  const { pathname, asPath, query } = useRouter()

  const { locale } = router
  const { slug } = router.query
  const { loading, error, data, refetch } = useQuery(ORGANIZATION_QUERY, {
    variables: { slug: slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  useEffect(() => {
    if (query.locale) {
      router.replace({ pathname }, asPath, { locale: query.locale })
    }
  })

  useEffect(() => {
    refetch()
  }, [locale])

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
