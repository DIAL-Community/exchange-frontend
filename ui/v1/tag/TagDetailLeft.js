import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import TagDetailHeader from './fragments/TagDetailHeader'
import TagDetailNav from './fragments/TagDetailNav'

const TagDetailLeft = ({ scrollRef, tag }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <TagDetailHeader tag={tag}/>
        <hr className='border-b border-dial-slate-200'/>
        <TagDetailNav tag={tag} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200'/>
        <Bookmark object={tag} objectType={ObjectType.TAG} />
        <hr className='border-b border-dial-slate-200'/>
        <Share />
        <hr className='border-b border-dial-slate-200'/>
        <Comment entityKey={'ui.tag.label'} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default TagDetailLeft
