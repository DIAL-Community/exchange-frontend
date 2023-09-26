import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'

const PlayDetailLeft = ({ play }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='px-4 lg:px-6 flex flex-col gap-y-3'>
        <hr className='border-b border-dial-slate-200'/>
        <Bookmark object={play} objectType={ObjectType.PLAY} />
        <hr className='border-b border-dial-slate-200'/>
        <Share />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default PlayDetailLeft
