import { useIntl } from 'react-intl'
import Breadcrumb from '../shared/breadcrumb'
import ProductCard from '../products/ProductCard'
import WorkflowCard from '../workflows/WorkflowCard'
import ReactHtmlParser from 'react-html-parser'
import { DiscourseForum } from '../shared/discourse'

import { descriptionByLocale } from '../../lib/utilities'
import { useRouter } from 'next/router'

const BuildingBlockDetailRight = ({ buildingBlock, discourseRef }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const { locale } = useRouter()

  const slugNameMapping = (() => {
    const map = {}
    map[buildingBlock.slug] = buildingBlock.name
    return map
  })()

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='fr-view text-dial-gray-dark'>
        {ReactHtmlParser(descriptionByLocale(buildingBlock.buildingBlockDescriptions, locale))}
      </div>
      {
        buildingBlock.products && buildingBlock.products.length > 0 &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('products.header')}</div>
            <div className='grid grid-cols-1'>
              {buildingBlock.products.map((product, i) => <ProductCard key={i} product={product} listType='list' />)}
            </div>
          </div>
      }
      {
        buildingBlock.workflows && buildingBlock.workflows.length > 0 &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('workflow.header')}</div>
            <div className='grid grid-cols-1'>
              {buildingBlock.workflows.map((workflow, i) => <WorkflowCard key={i} workflow={workflow} listType='list' />)}
            </div>
          </div>
      }
      <div className='mt-12' ref={discourseRef}>
        <div className='card-title mb-3'>{format('product.discussion')}</div>
        <DiscourseForum topicId={buildingBlock.discourseId} />
      </div>
    </div>
  )
}

export default BuildingBlockDetailRight
