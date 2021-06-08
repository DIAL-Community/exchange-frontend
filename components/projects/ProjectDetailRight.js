import { useIntl } from 'react-intl'
import ReactHtmlParser from 'react-html-parser'

import Breadcrumb from '../shared/breadcrumb'
import CountryCard from '../countries/CountryCard'
import OrganizationCard from '../organizations/OrganizationCard'
import ProductCard from '../products/ProductCard'
import SectorCard from '../sectors/SectorCard'
import TagCard from '../tags/TagCard'

const ProjectDetailRight = ({ project }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <div className='pl-6'>
      <Breadcrumb />
      <div className='fr-view text-dial-gray-dark'>
        {project.projectDescriptions[0] && ReactHtmlParser(project.projectDescriptions[0].description)}
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
      {
        project.countries &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('country.header')}</div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
              {project.countries.map((country, i) => <CountryCard key={i} country={country} listType='list' />)}
            </div>
          </div>
      }
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
            {project.tags.map((tag, i) => <TagCard key={i} tag={tag} listType='list' />)}
          </div>
      }
    </div>
  )
}

export default ProjectDetailRight
