import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import CityDetailHeader from './fragments/CityDetailHeader'
import CityDetailNav from './fragments/CityDetailNav'

const CityDetailLeft = ({ scrollRef, city }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <CityDetailHeader city={city}/>
        <hr className='border-b border-dial-slate-200'/>
        <CityDetailNav city={city} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200'/>
        <div className='hidden lg:block flex flex-col gap-y-3'>
          <Bookmark object={city} objectType={ObjectType.CITY} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
          <Comment entityKey={'ui.city.label'} scrollRef={scrollRef} />
          <hr className='border-b border-dial-slate-200'/>
        </div>
      </div>
    </div>
  )
}

export default CityDetailLeft
