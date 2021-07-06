import { useIntl } from 'react-intl'
import ReactHtmlParser from 'react-html-parser'
import { useRouter } from 'next/router'

import Breadcrumb from '../shared/breadcrumb'
import CountryCard from '../countries/CountryCard'
import OrganizationCard from '../organizations/OrganizationCard'
import ProductCard from '../products/ProductCard'
import SectorCard from '../sectors/SectorCard'
import TagCard from '../tags/TagCard'

const ProjectDetailRight = ({ project }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const router = useRouter()
  const { locale } = router

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
        {project.projectDescriptions && project.projectDescriptions.map(desc => {
          if (desc.locale === locale) {
            return ReactHtmlParser(desc.description)
          } else {
            return ''
          }
        })}
      </div>
      <div className='pb-5 pr-5 pt-4 overflow-ellipsis overflow-hidden'>
        <div className='h5 pb-1'>{format('project.url')}</div>
        <a className='text-dial-blue text-sm' href={`https://${project.url}`} target='_blank' rel='noreferrer'>{project.url}</a>
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
        project.sectorsWithLocale &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('sector.header')}</div>
            <div className='grid grid-cols-1 lg:grid-cols-2'>
              {project.sectorsWithLocale.map((sector, i) => <SectorCard key={i} sector={sector} listType='list' />)}
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
