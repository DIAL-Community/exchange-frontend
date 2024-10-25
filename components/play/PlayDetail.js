import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { PLAY_QUERY } from '../shared/query/play'
import PlayDetailLeft from './PlayDetailLeft'
import PlayDetailRight from './PlayDetailRight'

const PlayDetail = ({ playSlug, playbookSlug, locale }) => {
  const { data, loading, error } = useQuery(PLAY_QUERY, {
    variables: { playSlug, playbookSlug, owner: 'public' },
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
  } else if (!data?.play) {
    return handleMissingData()
  }

  const { play, playbook } = data

  const slugNameMapping = (() => {
    const map = {}
    map[play.slug] = play.name
    map[playbook.slug] = playbook.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='hidden lg:block basis-1/3'>
          <PlayDetailLeft play={play} scrollRef={scrollRef} />
        </div>
        <div className='basis-2/3'>
          <div className='px-4 lg:px-0 py-4 lg:py-6'>
            <PlayDetailRight playbook={playbook} play={play} ref={scrollRef} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayDetail
