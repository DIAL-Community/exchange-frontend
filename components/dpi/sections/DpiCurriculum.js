import { CurriculumContextProvider } from '../curriculum/CurriculumContext'
import CurriculumDetail from '../curriculum/CurriculumDetail'

const DpiCurriculum = ({ slug = 'cdr-analytics-for-covid19-with-flowkit' }) => {
  return (
    <CurriculumContextProvider>
      <CurriculumDetail slug={slug} locale='en' />
    </CurriculumContextProvider>
  )
}

export default DpiCurriculum
