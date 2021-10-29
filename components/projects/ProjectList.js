import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'

import ProjectCard from './ProjectCard'
import { ProjectFilterContext } from '../context/ProjectFilterContext'
import { FilterContext } from '../context/FilterContext'
import { HiSortAscending } from 'react-icons/hi'
import { Loading, Error } from '../shared/FetchStatus'

const DEFAULT_PAGE_SIZE = 20

const PROJECTS_QUERY = gql`
query SearchProjects(
  $first: Int,
  $after: String,
  $origins: [String!],
  $sectors: [String!],
  $countries: [String!],
  $organizations: [String!],
  $products: [String!],
  $sdgs: [String!],
  $tags: [String!],
  $search: String!
  ) {
  searchProjects(
    first: $first,
    after: $after,
    origins: $origins,
    sectors: $sectors,
    countries: $countries,
    organizations: $organizations,
    products: $products,
    sdgs: $sdgs,
    tags: $tags,
    search: $search
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
        locale
      }
      organizations {
        id
        slug
        name
        imageFile
      }
      products {
        id
        slug
        name
        imageFile
      }
      origin {
        slug
        name
      }
    }
  }
}
`

const ProjectList = (props) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4' : 'grid-cols-1'}`

  return (
    <>
      <div className={gridStyles}>
        {
          displayType === 'list' &&
            <div className='grid grid-cols-12 my-3 text-dial-gray-dark px-4 font-semibold '>
              <div className='col-span-3 lg:col-span-5 xl:col-span-4  mr-4 text-sm opacity-80'>
                {format('project.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div className='hidden lg:block col-span-3 md:col-span-3 lg:col-span-3 mr-4 text-sm opacity-50'>
                {format('organization.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div className='hidden lg:block col-span-3 md:col-span-3 lg:col-span-3 mr-4 text-sm opacity-50'>
                {format('product.header').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
            </div>
        }
        {
          props.projectList.map((project) => (
            <ProjectCard key={project.id} project={project} listType={displayType} />
          ))
        }
      </div>
    </>
  )
}

const ProjectListQuery = () => {
  const { resultCounts, displayType, setResultCounts } = useContext(FilterContext)
  const { origins, countries, sectors, organizations, products, sdgs, tags, search } = useContext(ProjectFilterContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { loading, error, data, fetchMore } = useQuery(PROJECTS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      origins: origins.map(origin => origin.value),
      countries: countries.map(country => country.value),
      sectors: sectors.map(sector => sector.value),
      organizations: organizations.map(organization => organization.value),
      products: products.map(product => product.value),
      sdgs: sdgs.map(sdg => sdg.value),
      tags: tags.map(tag => tag.label),
      search: search
    },
    onCompleted: (data) => {
      setResultCounts({ ...resultCounts, ...{ [['filter.entity.projects']]: data.searchProjects.totalCount } })
    }
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
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
        products: products.map(product => product.value),
        sdgs: sdgs.map(sdg => sdg.value),
        tags: tags.map(tag => tag.label),
        search: search
      }
    })
  }
  return (
    <InfiniteScroll
      className='relative px-2 mt-3 pb-8 max-w-catalog mx-auto'
      dataLength={nodes.length}
      next={handleLoadMore}
      hasMore={pageInfo.hasNextPage}
      loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
    >
      <ProjectList projectList={nodes} displayType={displayType} />
    </InfiniteScroll>
  )
}

export default ProjectListQuery
