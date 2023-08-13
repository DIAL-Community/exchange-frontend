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
        <hr className='bg-slate-200'/>
        <CityDetailNav city={city} scrollRef={scrollRef} />
        <hr className='bg-slate-200'/>
        <Bookmark object={city} objectType={ObjectType.CITY} />
        <hr className='bg-slate-200'/>
        <Share />
        <hr className='bg-slate-200'/>
        <Comment />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default CityDetailLeft
