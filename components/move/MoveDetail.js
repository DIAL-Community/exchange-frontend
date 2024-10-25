import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { MOVE_QUERY } from '../shared/query/move'
import MoveDetailLeft from './MoveDetailLeft'
import MoveDetailRight from './MoveDetailRight'

const MoveDetail = ({ moveSlug, playSlug, playbookSlug, locale }) => {
  const { loading, error, data } = useQuery(MOVE_QUERY, {
    variables: {
      moveSlug,
      playSlug,
      playbookSlug,
      owner: 'public'
    },
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

  const { move, play, playbook } = data

  const slugNameMapping = (() => {
    const map = {}
    map[move.slug] = move.name
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
          <MoveDetailLeft move={move} scrollRef={scrollRef} />
        </div>
        <div className='basis-2/3 pb-8'>
          <MoveDetailRight playbook={playbook} play={play} move={move} ref={scrollRef} />
        </div>
      </div>
    </div>
  )
}

export default MoveDetail
