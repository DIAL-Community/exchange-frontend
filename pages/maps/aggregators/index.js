import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/react-hooks'

import gql from 'graphql-tag'
import apolloClient from '../../../lib/apolloClient'

import Filter from '../../../components/filter/Filter'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

import AggregatorMap from '../../../components/maps/aggregators/AggregatorMap'
import { Loading, Error } from '../../../components/shared/FetchStatus'
import { MapFilterContext } from '../../../components/context/MapFilterContext'
import { useContext } from 'react'

const DEFAULT_PAGE_SIZE = 10000

const AGGREGATORS_QUERY = gql`
query SearchOrganizations(
  $first: Int,
  $aggregatorOnly: Boolean,
  $aggregators: [String!]
) {
  searchOrganizations(
    first: $first,
    aggregatorOnly: $aggregatorOnly,
    aggregators: $aggregators
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
        id
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

const COUNTRIES_QUERY = gql`
  query Countries($search: String) {
    countries(search: $search) {
      id
      name
      slug
      latitude
      longitude
    }
  }
`

const ProjectMapPage = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { aggregators, operators, services } = useContext(MapFilterContext)

  const fetchProjectData = () => {
    const aggregatorData = useQuery(AGGREGATORS_QUERY, {
      variables: {
        first: DEFAULT_PAGE_SIZE,
        aggregatorOnly: true,
        aggregators: aggregators.map(a => a.value)
      }
    })
    const countries = useQuery(COUNTRIES_QUERY)

    return [aggregatorData, countries]
  }

  const [
    { loading: loadingAggregators, data: aggregatorData, error: errorAggregator },
    { loading: loadingCountries, data: countryData, error: errorCountry }
  ] = fetchProjectData()

  if (loadingAggregators || loadingCountries) {
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

  if (errorAggregator || errorCountry) {
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

  const { searchOrganizations: { nodes } } = aggregatorData
  const { countries } = countryData

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <Filter activeTab='filter.entity.maps' />
      <AggregatorMap
        operators={operators} services={services}
        aggregators={nodes} countries={countries}
      />
      <Footer />
    </>
  )
}

export default apolloClient()(ProjectMapPage)
