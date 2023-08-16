import Bookmark from '../../shared/common/Bookmark'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import OrganizationDetailHeader from './fragments/OrganizationDetailHeader'

const OrganizationEditLeft = ({ organization }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <OrganizationDetailHeader organization={organization}/>
        <hr className='bg-slate-200'/>
        <Bookmark object={organization} objectType={ObjectType.ORGANIZATION}/>
        <hr className='bg-slate-200'/>
        <Share />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default OrganizationEditLeft
