import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { TAG_DETAIL_QUERY } from '../shared/query/tag'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import TagDetailRight from './TagDetailRight'
import TagDetailLeft from './TagDetailLeft'

const TagDetail = ({ slug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(TAG_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.tag) {
    return <NotFound />
  }

  const { tag } = data

  const slugNameMapping = (() => {
    const map = {}
    map[tag.slug] = tag.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <TagDetailLeft scrollRef={scrollRef} tag={tag} />
        </div>
        <div className='lg:basis-2/3'>
          <TagDetailRight ref={scrollRef} tag={tag} />
        </div>
      </div>
    </div>
  )
}

export default TagDetail
