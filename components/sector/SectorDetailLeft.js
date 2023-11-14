import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import SectorDetailHeader from './fragments/SectorDetailHeader'
import SectorDetailNav from './fragments/SectorDetailNav'

const SectorDetailLeft = ({ scrollRef, sector }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <SectorDetailHeader sector={sector}/>
        <hr className='border-b border-dial-slate-200'/>
        <SectorDetailNav sector={sector} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200'/>
        <div className='hidden lg:flex flex-col gap-y-3'>
          <Bookmark object={sector} objectType={ObjectType.SECTOR} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
          <Comment entityKey={'ui.sector.label'} scrollRef={scrollRef} />
          <hr className='border-b border-dial-slate-200'/>
        </div>
      </div>
    </div>
  )
}

export default SectorDetailLeft
