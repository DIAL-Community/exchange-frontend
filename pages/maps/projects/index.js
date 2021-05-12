import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/react-hooks'

import gql from 'graphql-tag'
import apolloClient from '../../../lib/apolloClient'

import Filter from '../../../components/filter/Filter'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

import ProjectMap from '../../../components/maps/projects/ProjectMap'
import { Loading, Error } from '../../../components/shared/FetchStatus'

const DEFAULT_PAGE_SIZE = 10000

const PROJECTS_QUERY = gql`
query SearchProjects(
  $first: Int,
  $sectors: [String!]
  ) {
  searchProjects(
    first: $first,
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
      countries {
        id
        name
        slug
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
    const projects = useQuery(PROJECTS_QUERY, {
      variables: {
        first: DEFAULT_PAGE_SIZE
      }
    })
    const countries = useQuery(COUNTRIES_QUERY)

    return [projects, countries]
  }

  const [
    { loading: loadingProjects, data: projectData, error: errorProject },
    { loading: loadingCountries, data: countryData, error: errorCountry }
  ] = fetchProjectData()

  if (loadingProjects || loadingCountries) {
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

  if (errorProject || errorCountry) {
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

  const { searchProjects: { nodes } } = projectData
  const { countries } = countryData

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <Filter activeTab='maps' />
      <ProjectMap projects={nodes} countries={countries} />
      <Footer />
    </>
  )
}

export default apolloClient()(ProjectMapPage)
