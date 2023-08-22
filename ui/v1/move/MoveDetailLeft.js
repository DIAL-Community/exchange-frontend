import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import MoveSimpleLeft from './fragments/MoveSimpleLeft'

const MoveDetailLeft = ({ move }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='px-4 lg:px-6 flex flex-col gap-y-3'>
        <MoveSimpleLeft move={move} />
        <hr className='border-b border-dial-slate-200'/>
        <hr className='border-b border-dial-slate-200'/>
        <Bookmark object={move} objectType={ObjectType.PLAYBOOK} />
        <hr className='border-b border-dial-slate-200'/>
        <Share />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default MoveDetailLeft
