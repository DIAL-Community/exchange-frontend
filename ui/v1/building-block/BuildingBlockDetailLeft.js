import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import BuildingBlockDetailHeader from './fragments/BuildingBlockDetailHeader'
import BuildingBlockDetailNav from './fragments/BuildingBlockDetailNav'

const BuildingBlockDetailLeft = ({ scrollRef, buildingBlock }) => {
  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-6 py-3'>
        <BuildingBlockDetailHeader buildingBlock={buildingBlock}/>
        <hr className='bg-slate-200'/>
        <BuildingBlockDetailNav scrollRef={scrollRef} />
        <hr className='bg-slate-200'/>
        <Bookmark object={buildingBlock} objectType={ObjectType.BUILDING_BLOCK} />
        <hr className='bg-slate-200'/>
        <Share />
        <hr className='bg-slate-200'/>
        <Comment />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default BuildingBlockDetailLeft
