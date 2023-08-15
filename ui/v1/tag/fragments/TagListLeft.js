import Bookmark from '../../shared/common/Bookmark'
import Comment from '../../shared/common/Comment'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'

const TagListLeft = () => {

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = '/tags'

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [activeFilter].filter(f => f).join('&')

    return `${baseUrl}${basePath}?${filterParameters}`
  }

  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <Bookmark sharableLink={sharableLink} objectType={ObjectType.URL} />
        <hr className='bg-slate-200' />
        <Share />
        <hr className='bg-slate-200' />
        <Comment />
        <hr className='bg-slate-200' />
      </div>
    </div>
  )
}

export default TagListLeft
