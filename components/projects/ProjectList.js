import { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'

import ProjectCard from './ProjectCard'
import { ProjectFilterContext } from '../context/ProjectFilterContext'
import { FilterResultContext, convertToKey } from '../context/FilterResultContext'

const DEFAULT_PAGE_SIZE = 20

const PROJECTS_QUERY = gql`
query SearchProjects(
  $first: Int,
  $after: String,
  $origins: [String!],
  $sectors: [String!],
  $countries: [String!],
  $organizations: [String!],
  $sdgs: [String!]
  ) {
  searchProjects(
    first: $first,
    after: $after,
    origins: $origins,
    sectors: $sectors,
    countries: $countries,
    organizations: $organizations,
    sdgs: $sdgs,
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
      projectDescriptions {
        description
      }
      origin {
        slug
      }
    }
  }
}
`

const ProjectList = (props) => {
  return (
    <>
      <div className='row grid grid-cols-4 gap-3'>
        {
          props.projectList.map((project) => {
            return <ProjectCard key={project.id} project={project} listType='list' />
          })
        }
      </div>
    </>
  )
}

const ProjectListQuery = () => {
  const { resultCounts, setResultCounts } = useContext(FilterResultContext)
  const { origins, countries, sectors, organizations, sdgs } = useContext(ProjectFilterContext)

  const { loading, error, data, fetchMore } = useQuery(PROJECTS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      origins: origins.map(origin => origin.value),
      countries: countries.map(country => country.value),
      sectors: sectors.map(sector => sector.value),
      organizations: organizations.map(organization => organization.value),
      sdgs: sdgs.map(sdg => sdg.value),
    },
    onCompleted: (data) => {
      setResultCounts({ ...resultCounts, ...{ [`${convertToKey('Projects')}`]: data.searchProjects.totalCount } })
    }
  })

  if (loading) {
    return <div>Fetching..</div>
  }
  if (error) {
    return <div>Error!</div>
  }

  const { searchProjects: { nodes, pageInfo } } = data

  function handleLoadMore () {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        origins: origins.map(origin => origin.value),
        countries: countries.map(country => country.value),
        sectors: sectors.map(sector => sector.value),
        organizations: organizations.map(organization => organization.value),
        sdgs: sdgs.map(organization => organization.value),
      }
    })
  }
  return (
    <InfiniteScroll
      dataLength={nodes.length}
      next={handleLoadMore}
      hasMore={pageInfo.hasNextPage}
      loader={<div>Loading...</div>}
    >
      <div id='content' className='container-fluid with-header p-3'>
        <ProjectList projectList={nodes} />
      </div>
    </InfiniteScroll>
  )
}

export default ProjectListQuery
