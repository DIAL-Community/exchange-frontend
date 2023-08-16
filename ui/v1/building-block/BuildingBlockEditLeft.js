import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import BuildingBlockDetailHeader from './fragments/BuildingBlockDetailHeader'

const BuildingBlockEditLeft = ({ buildingBlock }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <BuildingBlockDetailHeader buildingBlock={buildingBlock}/>
        <hr className='bg-slate-200'/>
        <Bookmark object={buildingBlock} objectType={ObjectType.BUILDING_BLOCK}/>
        <hr className='bg-slate-200'/>
        <Share />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default BuildingBlockEditLeft
