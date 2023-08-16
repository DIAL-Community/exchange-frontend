import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import OrganizationDetailHeader from './fragments/OrganizationDetailHeader'
import OrganizationDetailNav from './fragments/OrganizationDetailNav'
import OrganizationOwner from './fragments/OrganizationOwner'

const OrganizationDetailLeft = ({ scrollRef, organization }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <OrganizationDetailHeader organization={organization}/>
        <hr className='bg-slate-200'/>
        <OrganizationOwner organization={organization}/>
        <hr className='bg-slate-200'/>
        <OrganizationDetailNav organization={organization} scrollRef={scrollRef} />
        <hr className='bg-slate-200'/>
        <Bookmark object={organization} objectType={ObjectType.ORGANIZATION} />
        <hr className='bg-slate-200'/>
        <Share />
        <hr className='bg-slate-200'/>
        <Comment entityKey={'ui.organization.label'} scrollRef={scrollRef} />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default OrganizationDetailLeft
