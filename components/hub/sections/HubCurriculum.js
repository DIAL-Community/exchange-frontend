import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PLAYBOOK_DETAIL_QUERY } from '../../shared/query/playbook'
import { DPI_TENANT_NAME } from '../constants'
import { CurriculumContextProvider } from '../curriculum/CurriculumContext'
import CurriculumDetail from '../curriculum/CurriculumDetail'

const HubCurriculum = ({ curriculumSlug = 'cdr-analytics-for-covid19-with-flowkit' }) => {
  const { locale } = useRouter()

  const { data, loading, error } = useQuery(PLAYBOOK_DETAIL_QUERY, {
    variables: { slug: curriculumSlug, owner: DPI_TENANT_NAME },
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

  const { playbook: curriculum } = data

  return (
    <CurriculumContextProvider>
      <CurriculumDetail curriculum={curriculum} />
    </CurriculumContextProvider>
  )
}

export default HubCurriculum
