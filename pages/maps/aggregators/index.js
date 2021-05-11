import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/react-hooks'

import gql from 'graphql-tag'
import apolloClient from '../../../lib/apolloClient'

import Filter from '../../../components/filter/Filter'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

import AggregatorMap from '../../../components/maps/aggregators/AggregatorMap'

const DEFAULT_PAGE_SIZE = 10000

const AGGREGATORS_QUERY = gql`
query SearchOrganizations(
  $first: Int,
  $aggregatorOnly: Boolean,
  $sectors: [String!]
  ) {
  searchOrganizations(
    first: $first,
    aggregatorOnly: $aggregatorOnly,
    sectors: $sectors
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

  const fetchProjectData = () => {
    const aggregators = useQuery(AGGREGATORS_QUERY, {
      variables: {
        first: DEFAULT_PAGE_SIZE,
        aggregatorOnly: true
      }
    })
    const countries = useQuery(COUNTRIES_QUERY)

    return [aggregators, countries]
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
        <div className='relative text-center my-3'>{format('general.fetchingData')}</div>
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
        <div className='relative text-center my-3 default-height'>{format('general.fetchError')}</div>
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
      <Filter activeTab='maps' />
      <AggregatorMap aggregators={nodes} countries={countries} />
      <Footer />
    </>
  )
}

export default apolloClient()(ProjectMapPage)