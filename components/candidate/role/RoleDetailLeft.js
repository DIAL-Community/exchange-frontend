import Bookmark from '../../shared/common/Bookmark'
import Comment from '../../shared/common/Comment'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import RoleDetailHeader from './fragments/RoleDetailHeader'

const RoleDetailLeft = ({ scrollRef, role }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <RoleDetailHeader role={role}/>
        <hr className='border-b border-dial-slate-200'/>
        <div className='hidden lg:block flex flex-col gap-y-3'>
          <Bookmark object={role} objectType={ObjectType.ROLE} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
          <Comment entityKey={'ui.candidateRole.label'} scrollRef={scrollRef} />
          <hr className='border-b border-dial-slate-200'/>
        </div>
      </div>
    </div>
  )
}

export default RoleDetailLeft
