import Bookmark from '../../shared/Bookmark'
import Comment from '../../shared/Comment'
import Share from '../../shared/Share'
import { ObjectType } from '../../../utils/constants'
import OrganizationDetailHeader from './OrganizationDetailHeader'
import OrganizationDetailNav from './OrganizationDetailNav'
import OrganizationOwner from './OrganizationOwner'

const OrganizationDetailLeft = ({ scrollRef, organization }) => {
  return (
    <div className='bg-white shadow-xl rounded-2xl'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <OrganizationDetailHeader organization={organization}/>
        <hr className='border-b border-dial-slate-200'/>
        <OrganizationOwner organization={organization}/>
        <hr className='border-b border-dial-slate-200'/>
        <OrganizationDetailNav organization={organization} scrollRef={scrollRef}/>
        <hr className='border-b border-dial-slate-200'/>
        <div className='hidden lg:flex flex-col gap-y-3'>
          <Bookmark object={organization} objectType={ObjectType.ORGANIZATION}/>
          <hr className='border-b border-dial-slate-200'/>
          <Share/>
          <hr className='border-b border-dial-slate-200'/>
          <Comment entityKey={'ui.organization.label'} scrollRef={scrollRef}/>
        </div>
      </div>
    </div>
  )
}

export default OrganizationDetailLeft
