import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import { FixedSizeGrid, FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from 'react-window-infinite-loader'
import { FilterContext } from '../context/FilterContext'
import { ProjectFilterContext } from '../context/ProjectFilterContext'
import { Loading, Error } from '../shared/FetchStatus'
import NotFound from '../shared/NotFound'
import ProjectCard from './ProjectCard'

/* Default number of elements coming from graphql query. */
const DEFAULT_PAGE_SIZE = 20
/* Minimum width per project card. This will decide how many column we have in the page. */
/* The value is based on the minimum required to render Bahmni card. */
const MIN_PROJECT_CARD_WIDTH = 380
/* Default height of the project card. */
const MIN_PROJECT_CARD_HEIGHT = 450
/* Default spacing between project card in a row. This is 0.5 rem. */
const PROJECT_CARD_GUTTER_SIZE = 8
/* Height of the project's single list element when viewing the list view. */
const MIN_PROJECT_LIST_SIZE = 80

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

const ProjectListQuery = () => {
  const { resultCounts, filterDisplayed, displayType, setResultCounts } = useContext(FilterContext)
  const { origins, countries, sectors, organizations, products, sdgs, tags, search } = useContext(ProjectFilterContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
      search
    }
  })

  const handleLoadMore = () => {
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
        search
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts({
        ...resultCounts,
        ...{ [['filter.entity.projects']]: data.searchProjects.totalCount }
      })
    }
  }, [data])

  if (loading) {
    return <Loading />
  }

  if (error && error.networkError) {
    return <Error />
  }

  if (error && !error.networkError) {
    return <NotFound />
  }

  const { searchProjects: { nodes, pageInfo, totalCount } } = data
  if (nodes.length <= 0) {
    return (
      <div className='px-3 py-4'>
        {format('noResults.entity', { entity: format('project.label').toLowerCase() })}
      </div>
    )
  }

  const isProjectLoaded = (index) => !pageInfo.hasNextPage || index < nodes.length

  return (
    <div className='pt-4'>
      {
        displayType === 'list' &&
          <div className='flex flex-row my-3 px-4 gap-x-4'>
            <div className='w-3/12 text-sm font-semibold opacity-70'>
              {format('project.header').toUpperCase()}
            </div>
            <div className='hidden lg:block w-3/12 text-sm font-semibold opacity-50'>
              {format('organization.header').toUpperCase()}
            </div>
            <div className='hidden lg:block w-3/12 text-sm font-semibold opacity-50'>
              {format('product.header').toUpperCase()}
            </div>
          </div>
      }
      <div className='block pr-2' style={{ height: '80vh' }}>
        <AutoSizer>
          {({ height, width }) => (
            <InfiniteLoader
              isItemLoaded={isProjectLoaded}
              itemCount={totalCount}
              loadMoreItems={handleLoadMore}
            >
              {({ onItemsRendered, ref }) => {
                let columnCount = Math.floor(width / MIN_PROJECT_CARD_WIDTH)
                if (width < MIN_PROJECT_CARD_WIDTH) {
                  columnCount = 1
                }

                return (
                  <>
                    {
                      displayType === 'card' &&
                      <FixedSizeGrid
                        className='no-scrollbars'
                        height={height}
                        width={(width)}
                        rowHeight={MIN_PROJECT_CARD_HEIGHT}
                        columnWidth={width / columnCount}
                        rowCount={Math.floor(totalCount / columnCount) + 1}
                        columnCount={columnCount}
                        onItemsRendered={({
                          overscanColumnStartIndex,
                          overscanColumnStopIndex,
                          overscanRowStartIndex,
                          overscanRowStopIndex,
                          visibleColumnStartIndex,
                          visibleColumnStopIndex,
                          visibleRowStartIndex,
                          visibleRowStopIndex
                        }) => {
                          onItemsRendered({
                            overscanStartIndex: overscanColumnStartIndex + overscanRowStartIndex * columnCount,
                            overscanStopIndex: overscanColumnStopIndex + overscanRowStopIndex * columnCount,
                            visibleStartIndex: visibleColumnStartIndex + visibleRowStartIndex * columnCount,
                            visibleStopIndex: visibleColumnStopIndex + visibleRowStopIndex * columnCount
                          })
                        }}
                        ref={ref}
                      >
                        {({ columnIndex, rowIndex, style }) => {
                          const currentIndex = rowIndex * columnCount + columnIndex
                          const project = nodes[currentIndex]

                          return (
                            <div
                              style={{
                                ...style,
                                left: style.left + PROJECT_CARD_GUTTER_SIZE,
                                top: style.top + PROJECT_CARD_GUTTER_SIZE,
                                width: style.width - PROJECT_CARD_GUTTER_SIZE,
                                height: style.height - PROJECT_CARD_GUTTER_SIZE
                              }}
                            >
                              {
                                currentIndex < nodes.length && project &&
                                  <ProjectCard listType={displayType} {...{ project, filterDisplayed }} />
                              }
                              {currentIndex < nodes.length && !project && <Loading />}
                            </div>
                          )
                        }}
                      </FixedSizeGrid>
                    }
                    {
                      displayType === 'list' &&
                      <FixedSizeList
                        className='no-scrollbars'
                        height={height}
                        width={(width)}
                        itemSize={(MIN_PROJECT_LIST_SIZE)}
                        columnWidth={width / columnCount}
                        itemCount={totalCount}
                        onItemsRendered={({
                          overscanStartIndex,
                          overscanStopIndex,
                          visibleStartIndex,
                          visibleStopIndex
                        }) => {
                          onItemsRendered({
                            overscanStartIndex,
                            overscanStopIndex,
                            visibleStartIndex,
                            visibleStopIndex
                          })
                        }}
                        ref={ref}
                      >
                        {({ index, style }) => {
                          const project = nodes[index]

                          return (
                            <div style={style}>
                              {
                                index < nodes.length && project &&
                                  <ProjectCard listType={displayType} {...{ project, filterDisplayed }} />
                              }
                              {index < nodes.length && !project && <Loading />}
                            </div>
                          )
                        }}
                      </FixedSizeList>
                    }
                  </>
                )
              }}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    </div>
  )
}

export default ProjectListQuery
