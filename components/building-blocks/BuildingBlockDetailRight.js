import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import Breadcrumb from '../shared/breadcrumb'
import ProductCard from '../products/ProductCard'
import { DiscourseForum } from '../shared/discourse'
import BuildingBlockDetailWorkflows from './BuildingBlockDetailWorkflows'

const BuildingBlockDetailRight = ({ buildingBlock, discourseRef, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

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
        {buildingBlock.buildingBlockDescription && parse(buildingBlock.buildingBlockDescription.description)}
      </div>
      {
        buildingBlock.products && buildingBlock.products.length > 0 &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('products.header')}</div>
            <div className='text-sm text-dial-gray-dark pb-2 highlight-link' dangerouslySetInnerHTML={{ __html: format('building-block.disclaimer') }} />
            <div className='grid grid-cols-1'>
              {buildingBlock.products.map((product, i) => <ProductCard key={i} product={product} listType='list' />)}
            </div>
          </div>
      }
      {buildingBlock.workflows && <BuildingBlockDetailWorkflows buildingBlock={buildingBlock} canEdit={canEdit} />}
      <div className='mt-12' ref={discourseRef}>
        <div className='card-title mb-3'>{format('product.discussion')}</div>
        <div className='text-sm text-dial-gray-dark pb-2 highlight-link' dangerouslySetInnerHTML={{ __html: format('product.forum-desc-bb') }} />
        <DiscourseForum topicId={buildingBlock.discourseId} objType='bb' />
      </div>
    </div>
  )
}

export default BuildingBlockDetailRight
