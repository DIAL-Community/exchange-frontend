import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { ProjectFilterContext } from '../../../../components/context/ProjectFilterContext'
import { PROJECT_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/project'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import Pagination from '../../shared/Pagination'
import ListStructure from './ListStructure'
import ProjectSearchBar from './ProjectSearchBar'

const ProjectListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search } = useContext(ProjectFilterContext)
  const { countries, products, organizations, sectors, tags } = useContext(ProjectFilterContext)
  const { sdgs, origins } = useContext(ProjectFilterContext)

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)
  const topRef = useRef(null)

  const handlePageClick = (event) => {
    setPageNumber(event.selected)
    setPageOffset(event.selected * DEFAULT_PAGE_SIZE)

    if (topRef && topRef.current) {
      topRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  useEffect(() => {
    setPageNumber(0)
    setPageOffset(0)
  }, [search, countries, products, organizations, sectors, tags, sdgs, origins])

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
    }
  })

  return (
    <>
      <ProjectSearchBar ref={topRef} />
      <ListStructure
        pageOffset={pageOffset}
        defaultPageSize={DEFAULT_PAGE_SIZE}
      />
      { loading && format('ui.pagination.loadingInfo') }
      { error && format('ui.pagination.loadingInfoError') }
      { data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.paginationAttributeProject.totalCount}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          pageClickHandler={handlePageClick}
        />
      }
    </>
  )
}

export default ProjectListRight
