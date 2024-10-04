import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { FilterContext, FilterDispatchContext } from '../../context/FilterContext'
import { QueryParamContext } from '../../context/QueryParamContext'
import Bookmark from '../../shared/common/Bookmark'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import { parseQuery } from '../../utils/share'
import PlaybookFilter from './PlaybookFilter'

const PlaybookListLeft = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { tags } = useContext(FilterContext)
  const { setTags } = useContext(FilterDispatchContext)

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = '/products'

    const tagFilters = tags.map(tag => `tags=${tag.value}--${tag.label}`)

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [activeFilter, ...tagFilters].filter(f => f).join('&')

    return `${baseUrl}${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    if (
      query &&
      Object.getOwnPropertyNames(query).length > 1 &&
      query.shareCatalog && !interactionDetected
    ) {
      parseQuery(query, 'tags', tags, setTags)
    }
  })

  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <PlaybookFilter />
        <Bookmark sharableLink={sharableLink} objectType={ObjectType.URL} />
        <hr className='border-b border-dial-slate-200' />
        <Share />
        <hr className='border-b border-dial-slate-200' />
      </div>
    </div>
  )
}

export default PlaybookListLeft
