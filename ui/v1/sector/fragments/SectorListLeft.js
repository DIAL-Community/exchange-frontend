import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import Bookmark from '../../shared/common/Bookmark'
import Comment from '../../shared/common/Comment'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import { QueryParamContext } from '../../../../components/context/QueryParamContext'
import SectorFilter from './SectorFilter'

const SectorListLeft = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = '/sectors'

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [activeFilter].filter(f => f).join('&')

    return `${baseUrl}${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    const filtered = query && Object.getOwnPropertyNames(query).length > 1 && query.shareCatalog
    if (filtered && !interactionDetected) {
      // Apply filter here
    }
  })

  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <SectorFilter />
        <hr className='bg-slate-200' />
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

export default SectorListLeft
