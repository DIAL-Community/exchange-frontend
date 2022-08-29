import parse from 'html-react-parser'
import Breadcrumb from '../shared/breadcrumb'
import CommentsSection from '../shared/CommentsSection'
import { ObjectType } from '../../lib/constants'
import BuildingBlockDetailWorkflows from './BuildingBlockDetailWorkflows'
import BuildingBlockDetailProducts from './BuildingBlockDetailProducts'

const BuildingBlockDetailRight = ({ buildingBlock, canEdit, commentsSectionRef }) => {
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
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={buildingBlock.id}
        objectType={ObjectType.BUILDING_BLOCK}
      />
    </div>
  )
}

export default BuildingBlockDetailRight
