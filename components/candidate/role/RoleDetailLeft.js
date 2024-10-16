import Comment from '../../shared/common/Comment'
import Share from '../../shared/common/Share'
import RoleDetailHeader from './fragments/RoleDetailHeader'

const RoleDetailLeft = ({ scrollRef, role }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <RoleDetailHeader role={role}/>
        <hr className='border-b border-dial-slate-200'/>
        <div className='hidden lg:flex flex-col gap-y-3'>
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
