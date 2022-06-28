import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import Breadcrumb from '../shared/breadcrumb'
import OrganizationCard from '../organizations/OrganizationCard'
import ProductCard from '../products/ProductCard'
import SectorCard from '../sectors/SectorCard'
import TagCard from '../tags/TagCard'
import ProjectDetailCountries from './ProjectDetailCountries'

const ProjectDetailRight = ({ project, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const slugNameMapping = (() => {
    const map = {}
    map[project.slug] = project.name

    return map
  })()

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='fr-view text-dial-gray-dark text-sm'>
        <div className='card-title mb-3 text-dial-gray-dark'>{format('project.description')}</div>
        {project.projectDescription && parse(project.projectDescription.description)}
      </div>
      <div className='pb-5 pr-5 pt-4 text-ellipsis overflow-hidden'>
        <div className='h5 pb-1'>{format('project.url')}</div>
        <a className='text-dial-blue text-sm' href={`${project.projectUrl}`} target='_blank' rel='noreferrer'>{project.projectUrl}</a>
      </div>
      <div className='pb-5 pr-5'>
        <div className='h5 pb-1'>{format('project.source')}</div>
        <div className='inline text-sm'>{project.origin.name}</div>
      </div>
      {
        project.organizations &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('organization.header')}</div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
              {project.organizations.map((org, i) => <OrganizationCard key={i} organization={org} listType='card' />)}
            </div>
          </div>
      }
      {
        project.products &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('product.header')}</div>
            {project.products.map((product, i) => <ProductCard key={i} product={product} listType='list' />)}
          </div>
      }
      {project.countries && <ProjectDetailCountries project={project} canEdit={canEdit} />}
      {
        project.sectors &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('sector.header')}</div>
            <div className='grid grid-cols-1 lg:grid-cols-2'>
              {project.sectors.map((sector, i) => <SectorCard key={i} sector={sector} listType='list' />)}
            </div>
          </div>
      }
      {
        project.tags &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('tag.header')}</div>
            <div className='grid grid-cols-1 lg:grid-cols-2'>
              {project.tags.map((tag, i) => <TagCard key={i} tag={tag} listType='list' />)}
            </div>
          </div>
      }
    </div>
  )
}

export default ProjectDetailRight
