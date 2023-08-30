import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import PlaybookDetailNavigation from './fragments/PlaybookDetailNavigation'

const PlaybookDetailLeft = ({ scrollRef, playbook }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='top-[176px] sticky flex flex-col gap-y-3'>
        <PlaybookDetailNavigation playbook={playbook} />
        <div className='px-4 lg:px-6 flex flex-col gap-y-3 mt-3'>
          <hr className='border-b border-dial-slate-200'/>
          <Bookmark object={playbook} objectType={ObjectType.PLAYBOOK} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
          <Comment entityKey={'ui.product.label'} scrollRef={scrollRef} />
          <hr className='border-b border-dial-slate-200'/>
        </div>
      </div>
    </div>
  )
}

export default PlaybookDetailLeft
