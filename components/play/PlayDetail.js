import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { PlaybookContextProvider } from '../playbook/fragments/PlaybookContext'
import PlaybookPlay from '../playbook/fragments/PlaybookPlay'
import Breadcrumb from '../shared/Breadcrumb'
import CommentsSection from '../shared/comment/CommentsSection'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { PLAY_BREADCRUMB_QUERY } from '../shared/query/play'
import { ObjectType } from '../utils/constants'

const PlayDetail = ({ playbookSlug, playSlug }) => {
  const playRefs = useRef({})
  const commentsSectionRef = useRef()

  const { loading, data, error } = useQuery(PLAY_BREADCRUMB_QUERY, {
    variables: { playbookSlug, playSlug, owner: 'public' },
    context: {
      headers: {
        'Accept-Language': 'en',
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.playbook || !data?.play) {
    return handleMissingData()
  }

  const { playbook: playbook, play: playbookPlay } = data

  const slugNameMapping = (() => {
    const map = {}
    map[playbook.slug] = playbook.name
    map[playbookPlay.slug] = playbookPlay.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col min-h-[80vh]'>
      <div
        className='py-4 px-6 sticky bg-dial-blue-chalk text-dial-stratos'
        style={{ top: 'var(--header-height)' }}
      >
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <PlaybookContextProvider>
        <PlaybookPlay
          playbookSlug={playbookSlug}
          playSlug={playSlug}
          playRefs={playRefs}
        />
      </PlaybookContextProvider>
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={playbookPlay.id}
        objectType={ObjectType.PLAY}
      />
    </div>
  )
}

export default PlayDetail
