import { useQuery } from '@apollo/client'
import { useActiveTenant } from '../../../lib/hooks'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PLAYBOOK_DETAIL_QUERY } from '../../shared/query/playbook'
import { CurriculumContextProvider } from '../curriculum/CurriculumContext'
import CurriculumDetail from '../curriculum/CurriculumDetail'

const DpiCurriculum = ({ curriculumSlug = 'cdr-analytics-for-covid19-with-flowkit' }) => {
  // Fetch playbook data and make it our curriculum data
  const { tenant } = useActiveTenant()
  const { data, loading, error } = useQuery(PLAYBOOK_DETAIL_QUERY, {
    variables: { slug: curriculumSlug, owner: tenant },
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

export default DpiCurriculum
