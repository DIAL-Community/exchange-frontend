import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PLAYBOOK_DETAIL_QUERY } from '../../shared/query/playbook'
import { DPI_TENANT_NAME } from '../constants'
import { CurriculumContextProvider } from '../curriculum/CurriculumContext'
import CurriculumDetail from '../curriculum/CurriculumDetail'

const HubCurriculum = ({ curriculumSlug = 'cdr-analytics-for-covid19-with-flowkit' }) => {
  // Fetch playbook data and make it our curriculum data
  const { data, loading, error } = useQuery(PLAYBOOK_DETAIL_QUERY, {
    variables: { slug: curriculumSlug, owner: DPI_TENANT_NAME },
    context: { headers: { 'Accept-Language': 'en' } }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.playbook) {
    return <NotFound />
  }

  const { playbook: curriculum } = data

  return (
    <CurriculumContextProvider>
      <CurriculumDetail curriculum={curriculum} />
    </CurriculumContextProvider>
  )
}

export default HubCurriculum
