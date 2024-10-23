import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import ProjectCard from '../../project/ProjectCard'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import Pagination from '../../shared/Pagination'
import { WIZARD_PROJECTS_QUERY } from '../../shared/query/wizard'
import { DisplayType } from '../../utils/constants'
import { WizardContext } from '../WizardContext'

const ProjectList = ({ headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const DEFAULT_PAGE_SIZE = 5
  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const handlePageClick = (event) => {
    setPageNumber(event.selected)
    setPageOffset(event.selected * DEFAULT_PAGE_SIZE)
  }

  const { countries, sectors, sdgs, tags } = useContext(WizardContext)
  const { loading, error, data } = useQuery(WIZARD_PROJECTS_QUERY, {
    variables: {
      countries: countries.map(country => country.value),
      sectors: sectors.map(sector => sector),
      tags: tags.map(tag => tag.label),
      sdgs: sdgs.map(sdg => sdg.value),
      limit: DEFAULT_PAGE_SIZE,
      offset: pageOffset
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.paginatedProjects && data?.paginationAttributeProject) {
    return handleMissingData()
  }

  const {
    paginatedProjects: projects,
    paginationAttributeProject: paginationAttribute
  } = data

  return (
    <div className='flex flex-col gap-y-4' ref={headerRef}>
      <div className='flex flex-col gap-y-2'>
        <div className='text-xl font-semibold text-dial-plum'>
          {format('ui.project.header')}
        </div>
        <div className='text-xs italic'>
          {format('ui.wizard.product.description')}
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        {projects.map((project, index) =>
          <ProjectCard
            key={index}
            index={index}
            project={project}
            displayType={DisplayType.SMALL_CARD}
          />
        )}
      </div>
      <Pagination
        pageNumber={pageNumber}
        totalCount={paginationAttribute.totalCount}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        onClickHandler={handlePageClick}
      />
    </div>
  )
}

export default ProjectList
