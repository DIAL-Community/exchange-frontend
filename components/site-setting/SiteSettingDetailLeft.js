import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import SiteSettingDetailHeader from './fragments/SiteSettingDetailHeader'
import SiteSettingDetailNav from './fragments/SiteSettingDetailNav'

const SiteSettingDetailLeft = ({ scrollRef, siteSetting }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <SiteSettingDetailHeader siteSetting={siteSetting} />
        <hr className='border-b border-dial-slate-200' />
        <SiteSettingDetailNav siteSetting={siteSetting} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200' />
        <div className='hidden lg:flex flex-col gap-y-3'>
          <Bookmark object={siteSetting} objectType={ObjectType.SITE_SETTING} />
          <hr className='border-b border-dial-slate-200' />
          <Share />
          <hr className='border-b border-dial-slate-200' />
          <Comment entityKey={'ui.siteSetting.label'} scrollRef={scrollRef} />
          <hr className='border-b border-dial-slate-200' />
        </div>
      </div>
    </div>
  )
}

export default SiteSettingDetailLeft
