import { useQuery } from '@apollo/client'
import { useContext } from 'react'
import { FilterContext } from '../../context/FilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PAGINATED_PROJECTS_QUERY } from '../../shared/query/project'
import { DisplayType } from '../../utils/constants'
import ProjectCard from '../ProjectCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const {
    search,
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
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedProjects) {
    return <NotFound />
  }

  const { paginatedProjects: projects } = data

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
