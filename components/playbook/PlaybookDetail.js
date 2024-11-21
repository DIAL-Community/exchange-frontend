import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { PLAYBOOK_DETAIL_QUERY } from '../shared/query/playbook'
import { PlaybookContextProvider } from './fragments/PlaybookContext'
import Playbook from './fragments/Playbook'

const PlaybookDetail = ({ slug = 'cdr-analytics-for-covid19-with-flowkit' }) => {
  const { locale } = useRouter()

  const { data, loading, error } = useQuery(PLAYBOOK_DETAIL_QUERY, {
    variables: { slug, owner: 'public' },
    context: {
      headers: {
        'Accept-Language': locale,
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.playbook) {
    return handleMissingData()
  }

  const { playbook } = data

  return (
    <PlaybookContextProvider>
      <Playbook playbook={playbook} />
    </PlaybookContextProvider>
  )
}

export default PlaybookDetail
