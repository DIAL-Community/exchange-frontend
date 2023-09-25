import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import UserDetailHeader from './fragments/UserDetailHeader'
import UserDetailNav from './fragments/UserDetailNav'

const UserDetailLeft = ({ scrollRef, user }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <UserDetailHeader user={user}/>
        <hr className='border-b border-dial-slate-200'/>
        <UserDetailNav user={user} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200'/>
        <div className='hidden lg:block flex flex-col gap-y-3'>
          <Bookmark object={user} objectType={ObjectType.USER} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
          <Comment entityKey={'ui.user.label'} scrollRef={scrollRef} />
          <hr className='border-b border-dial-slate-200'/>
        </div>
      </div>
    </div>
  )
}

export default UserDetailLeft
