import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Head from 'next/head'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

import withApollo from '../../../lib/apolloClient'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import OrganizationDetailLeft from '../../../components/organizations/OrganizationDetailLeft'
import OrganizationDetailRight from '../../../components/organizations/OrganizationDetailRight'
import { Loading, Error } from '../../../components/shared/FetchStatus'

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
    organizationDescriptions {
      description
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
  const { slug } = router.query
  const { loading, error, data } = useQuery(ORGANIZATION_QUERY, { variables: { slug: slug } })
  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      {loading && <Loading />}
      {error && <Error />}
      {
        data && data.organization &&
          <div className='flex justify-between'>
            <div className='relative md:sticky md:top-66px w-full md:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <OrganizationDetailLeft organization={data.organization} />
            </div>
            <div className='w-full md:w-2/3 xl:w-3/4'>
              <OrganizationDetailRight organization={data.organization} />
            </div>
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(Organization)
