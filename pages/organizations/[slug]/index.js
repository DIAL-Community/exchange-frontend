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
    imageFile
    website
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

  if (loading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    )
  }
  if (error) {
    return (
      <>
        <Header />
        <Error />
      </>
    )
  }

  const organization = data.organization
  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='w-full h-full flex flex-col md:flex-row p-6 page-gradient'>
        <div className='w-full xl:w-1/4 md:w-1/3 pt-4'>
          <OrganizationDetailLeft organization={organization} />
        </div>
        <div className='w-full xl:w-3/4 md:w-2/3 pt-4 h-screen overflow-y-scroll'>
          <OrganizationDetailRight organization={organization} />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default withApollo()(Organization)
