import { FormattedDate, useIntl } from 'react-intl'
import Breadcrumb from '../shared/breadcrumb'
import ProductCard from '../products/ProductCard'
import WorkflowCard from '../workflows/WorkflowCard'
import ReactHtmlParser from 'react-html-parser'
import { DiscourseForum } from '../shared/discourse'

const BuildingBlockDetailRight = ({ buildingBlock }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <div className=''>
      <Breadcrumb />
      <div className='fr-view'>
        {buildingBlock.buildingBlockDescriptions[0] && ReactHtmlParser(buildingBlock.buildingBlockDescriptions[0].description)}
      </div>
      {
        buildingBlock.products && buildingBlock.products.length > 0 &&
          <div className='mt-12'>
            <div className='card-title mb-3'>{format('workflow.header')}</div>
            <div className='grid grid-cols-1'>
              {buildingBlock.products.map((product, i) => <ProductCard key={i} product={product} listType='list' />)}
            </div>
          </div>
      }
      {
        buildingBlock.workflows && buildingBlock.workflows.length > 0 &&
          <div className='mt-12'>
            <div className='card-title mb-3'>{format('workflow.header')}</div>
            <div className='grid grid-cols-1'>
              {buildingBlock.workflows.map((workflow, i) => <WorkflowCard key={i} workflow={workflow} listType='list' />)}
            </div>
          </div>
      }
      {buildingBlock.discourseId &&
        <div className='mt-12'>
          <div className='card-title mb-3'>{format('product.discussion')}</div>
          <DiscourseForum topicId={buildingBlock.discourseId} />
        </div>
      }
    </div>
  )
}

export default BuildingBlockDetailRight
