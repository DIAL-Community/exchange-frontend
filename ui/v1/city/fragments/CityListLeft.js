import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import Bookmark from '../../shared/common/Bookmark'
import Comment from '../../shared/common/Comment'
import Share from '../../shared/common/Share'
import { ObjectType, REBRAND_BASE_PATH } from '../../utils/constants'
import { QueryParamContext } from '../../../../components/context/QueryParamContext'

const CityListLeft = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = `${REBRAND_BASE_PATH}/cities`

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [activeFilter].filter(f => f).join('&')

    return `${baseUrl}${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    const filtered = query && Object.getOwnPropertyNames(query).length > 1 && query.shareCatalog
    if ( filtered && !interactionDetected) {
      // Filtering in the future?
    }
  })

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

export default CityListLeft
