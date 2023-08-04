import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import SdgDetailHeader from './fragments/SdgDetailHeader'
import SdgDetailNav from './fragments/SdgDetailNav'
import SdgOwner from './fragments/SdgOwner'

const SdgDetailLeft = ({ scrollRef, sdg }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <SdgDetailHeader sdg={sdg}/>
        <hr className='bg-slate-200'/>
        <SdgOwner sdg={sdg}/>
        <hr className='bg-slate-200'/>
        <SdgDetailNav sdg={sdg} scrollRef={scrollRef} />
        <hr className='bg-slate-200'/>
        <Bookmark object={sdg} objectType={ObjectType.SDG} />
        <hr className='bg-slate-200'/>
        <Share />
        <hr className='bg-slate-200'/>
        <Comment />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default SdgDetailLeft
