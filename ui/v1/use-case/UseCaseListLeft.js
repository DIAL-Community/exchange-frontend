import Bookmark from '../shared/Bookmark'
import Comment from '../shared/Comment'
import Share from '../shared/Share'

const UseCaseListLeft = () => {
  return (
    <div className='bg-dial-slate-100'>
      <div className='flex flex-col gap-y-3 px-6 py-8'>
        <Bookmark />
        <hr />
        <Share />
        <hr />
        <Comment />
      </div>
    </div>
  )
}

export default UseCaseListLeft
