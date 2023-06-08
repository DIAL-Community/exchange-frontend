import Breadcrumb from '../shared/breadcrumb'
import { HtmlViewer } from '../shared/HtmlViewer'
import CommentsSection from '../shared/comment/CommentsSection'
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
      <HtmlViewer
        initialContent={buildingBlock?.buildingBlockDescription?.description}
        className='px-12 border pt-12 border-dial-gray shadow-md'
      />
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
