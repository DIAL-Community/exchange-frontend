import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import Breadcrumb from '../shared/breadcrumb'
import { DiscourseForum } from '../shared/discourse'
import BuildingBlockDetailWorkflows from './BuildingBlockDetailWorkflows'
import BuildingBlockDetailProducts from './BuildingBlockDetailProducts'

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
      {buildingBlock.products && <BuildingBlockDetailProducts buildingBlock={buildingBlock} canEdit={canEdit} />}
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
