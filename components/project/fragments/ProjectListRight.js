import { useCallback, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { CollectionPageSize, FilterContext } from '../../context/FilterContext'
import Pagination from '../../shared/Pagination'
import { PROJECT_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/project'
import ListStructure from './ListStructure'
import ProjectSearchBar from './ProjectSearchBar'

const ProjectListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    search,
    collectionDisplayType,
    countries,
    organizations,
    origins,
    products,
    sdgs,
    sectors,
    tags
  } = useContext(FilterContext)

  const topRef = useRef(null)
  const { push, query } = useRouter()

  const { 'project-page': projectPage } = query
  const pageNumber = projectPage ? parseInt(projectPage) - 1 : 0
  const pageOffset = pageNumber * CollectionPageSize[collectionDisplayType]

  const onClickHandler = ({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage === 'undefined' ? selected : nextSelectedPage
    push(
      { query: { ...query, 'project-page': destinationPage + 1 } },
      undefined,
      { shallow: true }
    )
    // Scroll to top of the page
    if (topRef && topRef.current) {
      topRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  const { loading, error, data } = useQuery(PROJECT_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      countries: countries.map(country => country.value),
      products: products.map(product => product.value),
      organizations: organizations.map(organization => organization.value),
      sectors: sectors.map(sector => sector.value),
      tags: tags.map(tag => tag.label),
      sdgs: sdgs.map(sdg => sdg.value),
      origins: origins.map(origin => origin.value)
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  return (
    <>
      <ProjectSearchBar ref={topRef} />
      <ListStructure
        pageOffset={pageOffset}
        defaultPageSize={CollectionPageSize[collectionDisplayType]}
      />
      {loading && format('ui.pagination.loadingInfo')}
      {error && format('ui.pagination.loadingInfoError')}
      {data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.paginationAttributeProject.totalCount}
          defaultPageSize={CollectionPageSize[collectionDisplayType]}
          onClickHandler={onClickHandler}
        />
      }
    </>
  )
}

export default ProjectListRight
