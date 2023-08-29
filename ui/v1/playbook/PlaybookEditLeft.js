import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import PlaybookSimpleLeft from './fragments/PlaybookSimpleLeft'

const PlaybookEditLeft = ({ playbook }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <PlaybookSimpleLeft playbook={playbook} />
        <hr className='border-b border-dial-slate-200'/>
        <Bookmark object={playbook} objectType={ObjectType.PLAYBOOK}/>
        <hr className='border-b border-dial-slate-200'/>
        <Share />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default PlaybookEditLeft
