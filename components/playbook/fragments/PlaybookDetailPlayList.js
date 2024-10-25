import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import PlayDetailRight from '../../play/PlayDetailRight'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PLAYS_QUERY } from '../../shared/query/play'

const PlaybookDetailPlayList = ({ locale, playbook }) => {
  const { loading, error, data } = useQuery(PLAYS_QUERY, {
    variables: {
      playbookSlug: playbook.slug,
      owner: 'public'
    },
    context: {
      headers: {
        'Accept-Language': locale,
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  // Loading and error handler section.
  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (data?.plays) {
    return handleMissingData()
  }

  const { plays } = data

  return (
    <div className='flex flex-col gap-y-6'>
      {plays.map((play, i) =>
        <div key={i}>
          <hr className='border-b border-dial-slate-200' />
          <PlayDetailRight key={i} playbook={playbook} play={play} index={i} />
        </div>
      )}
    </div>
  )
}

export default PlaybookDetailPlayList
