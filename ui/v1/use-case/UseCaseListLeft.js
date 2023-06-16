import Bookmark from '../shared/Bookmark'
import Share from '../shared/Share'

const UseCaseListLeft = () => {
  return (
    <div className='bg-dial-slate-100'>
      <div className='flex flex-col gap-y-3 px-6 py-8'>
        <Bookmark />
        <hr />
        <Share />
      </div>
    </div>
  )
}

export default UseCaseListLeft
