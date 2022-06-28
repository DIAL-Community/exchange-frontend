import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import { useSession } from 'next-auth/client'
import Breadcrumb from '../shared/breadcrumb'
import CountryCard from '../countries/CountryCard'
import ProductCard from '../products/ProductCard'
import SectorCard from '../sectors/SectorCard'
import TagCard from '../tags/TagCard'
import OrganizationCard from '../organizations/OrganizationCard'
import ProjectDetailSectors from './ProjectDetailSectors'
import ProjectDetailOrganizations from './ProjectDetailOrganizations'
import ProjectDetailCountries from './ProjectDetailCountries'
import ProjectDetailTags from './ProjectDetailTags'

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
      {project.organizations && <ProjectDetailOrganizations project={project} canEdit={canEdit} />}
      {
        project.products &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('product.header')}</div>
            {project.products.map((product, i) => <ProductCard key={i} product={product} listType='list' />)}
          </div>
      }
      {project.sectors && <ProjectDetailSectors project={project} canEdit={canEdit} />}
      {project.countries && <ProjectDetailCountries project={project} canEdit={canEdit} />}
      {project.tags && <ProjectDetailTags project={project} canEdit={canEdit} />}
    </div>
  )
}

export default ProjectDetailRight
