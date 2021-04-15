import { useIntl } from 'react-intl'
import ReactHtmlParser from 'react-html-parser'
import Breadcrumb from '../shared/breadcrumb'
import RepositoryDetail from './RepositoryDetail'
import OrganizationCard from '../organizations/OrganizationCard'
import BuildingBlockCard from '../building-blocks/BuildingBlockCard'
import SDGCard from '../sdgs/SDGCard'
import SectorCard from '../sectors/SectorCard'
import ProjectCard from '../projects/ProjectCard'

const ProductDetailRight = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const currVersion = (product.statistics.data && product.statistics.data.repository.releases && product.statistics.data.repository.releases.edges[0]) ? product.statistics.data.repository.releases.edges[0].node.name : null
  return (
    <div className='pl-6'>
      <Breadcrumb />
      <div className='w-full flex'>
        <div className='w-2/5 mr-4 border-r text-dial-purple-light'>
          <div className='pb-5'>
            <div className='h5 pb-1'>{format('product.website')}</div>
            <a className='text-dial-blue text-sm' href={`https://${product.website}`} target='_blank'>{product.website}</a>
          </div>
          <div className='pb-5'>
            <div className='h5 pb-1'>{format('product.repository')}</div>
            <a className='text-dial-blue text-sm' href={`https://${product.repository}`} target='_blank'>{product.repository}</a>
          </div>
          <div className='pb-5 grid grid-cols-2'>
            <div>
              <div className='h5 pb-1'>{format('product.current-version')}</div>
              <div className='text-sm'>{currVersion ? currVersion : format('product.no-version-data')}</div>
            </div>
            <div>
              <div className='h5 pb-1'>{format('product.license')}</div>
              <div className='text-sm'>{product.license}</div>
            </div>
          </div>
          <div className='pb-5'>
            <div className='h5 pb-1'>{format('product.source')}</div>
            {product.origins.map((origin) => {
              return (<div className='text-sm'>{origin.name}</div>)
            })}
          </div>
        </div>
        <div className='w-3/5 ml-4'>
          <RepositoryDetail repositoryData={product.statistics.data && product.statistics.data.repository} languageData={product.languageData.data && product.languageData.data.repository} />
        </div>
      </div>
      {product.organizations && 
        <div className='mt-12'>
          <div className='card-title mb-3'>{format('organization.header')}</div>
          {product.organizations.map((org, i) => {
            return (<OrganizationCard key={i} organization={org} listType='list' />)
          })}
        </div>
      }
      {product.buildingBlocks && 
        <div className='mt-12'>
          <div className='card-title mb-3'>{format('building-block.header')}</div>
          {product.buildingBlocks.map((bb, i) => {
            return (<BuildingBlockCard key={i} buildingBlock={bb} listType='list' />)
          })}
        </div>
      }
      {product.sustainableDevelopmentGoals && 
        <div className='mt-12'>
          <div className='card-title mb-3'>{format('sdg.header')}</div>
          {product.sustainableDevelopmentGoals.map((sdg, i) => {
            return (<SDGCard key={i} sdg={sdg} listType='list' />)
          })}
        </div>
      }
      {product.sectors && 
        <div className='mt-12'>
          <div className='card-title mb-3'>{format('sector.header')}</div>
          <div className='grid grid-cols-3'>
            {product.sectors.map((sector, i) => {
              return (<SectorCard key={i} sector={sector} listType='list' />)
            })}
          </div>
        </div>
      }
      {product.currProjects && 
        <div className='mt-12'>
          <div className='card-title mb-3'>{format('project.header')}</div>
            {product.currProjects.map((project, i) => {
              return (<ProjectCard key={i} project={project} listType='list' />)
            })}
        </div>
      }
    </div>
  )
}

export default ProductDetailRight
