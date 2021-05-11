import { useIntl } from 'react-intl'
import ReactHtmlParser from 'react-html-parser'
import Breadcrumb from '../shared/breadcrumb'
import { DiscourseForum } from '../shared/discourse'
import RepositoryDetail from './RepositoryDetail'
import OrganizationCard from '../organizations/OrganizationCard'
import BuildingBlockCard from '../building-blocks/BuildingBlockCard'
import SDGCard from '../sdgs/SDGCard'
import SectorCard from '../sectors/SectorCard'
import ProjectCard from '../projects/ProjectCard'
import ProductCard from './ProductCard'
import RepositoryInfo from './RepositoryInfo'
import MaturityAccordion from './Maturity'

const ProductDetailRight = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <div className='pl-6'>
      <Breadcrumb />
      <div className='w-full flex'>
        <div className='w-2/5 mr-4 border-r text-dial-purple-light'>
          { (product.childProducts.length > 0) && <div className='mb-2'>{product.name}</div>}
          <RepositoryInfo product={product} />
        </div>
        <div className='w-3/5 ml-4'>
          <RepositoryDetail repositoryData={product.statistics.data && product.statistics.data.repository} languageData={product.languageData.data && product.languageData.data.repository} />
        </div>
      </div>
      { product.childProducts && product.childProducts.map((childProd, i) => {
        return (
          <div key={i} className='w-full flex mt-10'>
            <div className='w-2/5 mr-4 border-r text-dial-purple-light'>
              <div className='mb-2'>{childProd.name}</div>
              <RepositoryInfo product={childProd} />
            </div>
            <div className='w-3/5 ml-4'>
              <RepositoryDetail repositoryData={childProd.statistics.data && childProd.statistics.data.repository} languageData={childProd.languageData.data && childProd.languageData.data.repository} />
            </div>
          </div>
        )
      })}
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
      {product.codeLines && 
        <div className='mt-12'>
          <div className='card-title mb-3'>{format('product.cost-data')}</div>
          <div className='pb-5'>
            <div className='h5 pb-1'>{format('product.code-lines')}</div>
            <div className='text-sm'>{product.codeLines}</div>
          </div>
          <div className='pb-5'>
            <div className='h5 pb-1'>{format('product.est-effort')}</div>
            <div className='text-sm'>{product.cocomo}</div>
          </div>
        </div>
      }
      <div className='mt-12 grid grid-cols-2'>
        <div>
          <div className='card-title mb-3'>{format('product.interoperable')}</div>
          { (product.interoperatesWith.length > 0) ? 
            product.interoperatesWith.map((interopProd) => {
              return (<div className='pb-5 mr-6'>
                <ProductCard product={interopProd} listType='list' />
              </div>)}) 
            :
            (<div className='text-sm pb-5'>{format('product.no-interop')}</div>)
          }
        </div>
        <div>
          <div className='card-title mb-3'>{format('product.included')}</div>
          { (product.includes.length > 0) ? 
            product.includes.map((includeProd) => {
              return (<div className='pb-5 mr-6'>
                <ProductCard product={includeProd} listType='list' />
              </div>)}) 
            :
            (<div className='text-sm pb-5'>{format('product.no-include')}</div>)
          }
        </div>
      </div>
      <div className='mt-12'>
        <div className='card-title mb-3'>{format('product.maturity-scores')}</div>
        { product.maturityScore ? <MaturityAccordion maturityScores={product.maturityScores} overallScore={product.maturityScore} />
          : <div className='text-sm pb-5'>{format('product.no-maturity')}</div>
        }
      </div>
      <div className='mt-12'>
        <div className='card-title mb-3'>{format('product.discussion')}</div>
        <DiscourseForum topicId={product.discourseId} />
      </div>
    </div>
  )
}

export default ProductDetailRight
