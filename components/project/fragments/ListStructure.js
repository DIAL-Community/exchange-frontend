import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { CollectionDisplayType, FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PAGINATED_PROJECTS_QUERY } from '../../shared/query/project'
import { DisplayType } from '../../utils/constants'
import ProjectCard from '../ProjectCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
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

  const { loading, error, data } = useQuery(PAGINATED_PROJECTS_QUERY, {
    variables: {
      search,
      countries: countries.map(country => country.value),
      organizations: organizations.map(organization => organization.value),
      origins: origins.map(origin => origin.value),
      products: products.map(product => product.value),
      sdgs: sdgs.map(sdg => sdg.value),
      sectors: sectors.map(sector => sector.value),
      tags: tags.map(tag => tag.label),
      limit: defaultPageSize,
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
  } else if (!data?.paginatedProjects) {
    return handleMissingData()
  }

  const listDisplay = (projects) => (
    <div className='flex flex-col gap-3'>
      {projects.map((project, index) =>
        <div key={index}>
          <ProjectCard
            index={index}
            project={project}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )

  const gridDisplay = (projects) => (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
      {projects.map((project, index) =>
        <div key={index}>
          <ProjectCard
            index={index}
            project={project}
            displayType={DisplayType.GRID_CARD}
          />
        </div>
      )}
    </div>
  )

  const { paginatedProjects: projects } = data

  return collectionDisplayType === CollectionDisplayType.LIST
    ? listDisplay(projects)
    : gridDisplay(projects)
}

export default ListStructure
