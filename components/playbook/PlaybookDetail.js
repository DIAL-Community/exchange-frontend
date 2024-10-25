import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { PLAYBOOK_DETAIL_QUERY } from '../shared/query/playbook'
import PlaybookDetailHeader from './fragments/PlaybookDetailHeader'
import PlaybookDetailLeft from './PlaybookDetailLeft'
import PlaybookDetailRight from './PlaybookDetailRight'

const PlaybookDetail = ({ slug, locale }) => {
  const { data, loading, error } = useQuery(PLAYBOOK_DETAIL_QUERY, {
    variables: { slug, owner: 'public' },
    context: {
      headers: {
        'Accept-Language': locale,
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  const scrollRef = useRef(null)

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.playbook) {
    return handleMissingData()
  }

  const { playbook } = data

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <PlaybookDetailHeader playbook={playbook} />
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='hidden lg:block basis-1/3'>
          <PlaybookDetailLeft playbook={playbook} scrollRef={scrollRef} />
        </div>
        <div className='basis-2/3 px-4 lg:px-6'>
          <PlaybookDetailRight playbook={playbook} locale={locale} ref={scrollRef} />
        </div>
      </div>
    </div>
  )
}

export default PlaybookDetail
