import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { SDG_DETAIL_QUERY } from '../shared/query/sdg'
import SdgDetailLeft from './SdgDetailLeft'
import SdgDetailRight from './SdgDetailRight'

const SdgDetail = ({ slug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(SDG_DETAIL_QUERY, {
    variables: { slug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.sdg) {
    return handleMissingData()
  }

  const { sdg } = data

  const slugNameMapping = (() => {
    const map = {}
    map[sdg.slug] = sdg.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <SdgDetailLeft scrollRef={scrollRef} sdg={sdg} />
        </div>
        <div className='lg:basis-2/3'>
          <SdgDetailRight ref={scrollRef} sdg={sdg} />
        </div>
      </div>
    </div>
  )
}

export default SdgDetail
