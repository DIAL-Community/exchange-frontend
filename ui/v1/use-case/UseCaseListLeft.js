import Bookmark from '../shared/filter/Bookmark'
import Comment from '../shared/filter/Comment'
import Share from '../shared/filter/Share'

const UseCaseListLeft = () => {
  return (
    <div className='bg-dial-slate-100'>
      <div className='flex flex-col gap-y-3 px-6 py-8'>
        <Bookmark />
        <hr className='bg-slate-200'/>
        <Share />
        <hr className='bg-slate-200'/>
        <Comment />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default UseCaseListLeft
