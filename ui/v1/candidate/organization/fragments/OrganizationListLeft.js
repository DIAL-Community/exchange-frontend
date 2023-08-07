import Comment from '../../../shared/common/Comment'
import Share from '../../../shared/common/Share'

const OrganizationListLeft = () => {

  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <Share />
        <hr className='bg-slate-200' />
        <Comment />
        <hr className='bg-slate-200' />
      </div>
    </div>
  )
}

export default OrganizationListLeft
