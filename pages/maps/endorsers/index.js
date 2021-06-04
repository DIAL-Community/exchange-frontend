import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/react-hooks'

import gql from 'graphql-tag'
import apolloClient from '../../../lib/apolloClient'

import Filter from '../../../components/filter/Filter'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

import EndorserMap from '../../../components/maps/endorsers/EndorserMap'
import { MapFilterContext } from '../../../components/context/MapFilterContext'
import { Loading, Error } from '../../../components/shared/FetchStatus'
import { useContext } from 'react'

const DEFAULT_PAGE_SIZE = 1000

const ORGANIZATIONS_QUERY = gql`
query SearchOrganizations(
  $first: Int,
  $sectors: [String!],
  $years: [Int!],
) {
  searchOrganizations(
    first: $first,
    sectors: $sectors,
    years: $years
  ) {
    __typename
    totalCount
    pageInfo {
      endCursor
      startCursor
      hasPreviousPage
      hasNextPage
    }
    nodes {
      id
      name
      slug
      website
      whenEndorsed
      countries {
        name
        slug
        latitude
        longitude
      }
      offices {
        id
        name
        latitude
        longitude
      }
    }
  }
}
`

const EndorserMapPage = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { orgSectors, years } = useContext(MapFilterContext)

  const { loading, error, data } = useQuery(ORGANIZATIONS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      sectors: orgSectors.map(sector => sector.value),
      years: years.map(year => year.value),
    }
  })

  if (loading) {
    return (
      <>
        <Head>
          <title>{format('app.title')}</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <Header />
        <Loading />
      </>
    )
  }
  if (error) {
    return (
      <>
        <Head>
          <title>{format('app.title')}</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <Header />
        <Error />
      </>
    )
  }

  const { searchOrganizations: { nodes } } = data

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <Filter activeTab='filter.entity.maps' />
      <EndorserMap organizations={nodes} />
      <Footer />
    </>
  )
}

export default apolloClient()(EndorserMapPage)
