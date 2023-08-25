import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_PROJECTS_QUERY } from '../../shared/query/project'
import { ProjectFilterContext } from '../../../../components/context/ProjectFilterContext'
import ProjectCard from '../ProjectCard'
import { DisplayType } from '../../utils/constants'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(ProjectFilterContext)

  const { countries, products, organizations, sectors, tags } = useContext(ProjectFilterContext)
  const { sdgs, origins } = useContext(ProjectFilterContext)

  const { loading, error, data } = useQuery(PAGINATED_PROJECTS_QUERY, {
    variables: {
      search,
      countries: countries.map(country => country.value),
      products: products.map(product => product.value),
      organizations: organizations.map(organization => organization.value),
      sectors: sectors.map(sector => sector.value),
      tags: tags.map(tag => tag.label),
      sdgs: sdgs.map(sdg => sdg.value),
      origins: origins.map(origin => origin.value),
      limit: defaultPageSize,
      offset: pageOffset
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedProjectsRedux) {
    return <NotFound />
  }

  const { paginatedProjectsRedux: projects } = data

  return (
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
}

export default ListStructure
