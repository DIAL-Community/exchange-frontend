import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PLAY_QUERY } from '../../shared/query/play'
import CurriculumModuleForm from '../curriculum/forms/CurriculumModuleForm'

const EditDpiCurriculumModule = ({ curriculumSlug, curriculumModuleSlug }) => {
  const router = useRouter()

  const { loading, error, data } = useQuery(PLAY_QUERY, {
    variables: { playSlug: curriculumModuleSlug, playbookSlug: curriculumSlug },
    context: { headers: { 'Accept-Language': router.locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.playbook) {
    return <NotFound />
  }

  const { playbook: curriculum, play: curriculumModule } = data

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <CurriculumModuleForm curriculum={curriculum} curriculumModule={curriculumModule} />
    </div>
  )
}

const CreateDpiCurriculumModule = ({ curriculumSlug }) => {
  const router = useRouter()

  const { loading, error, data } = useQuery(PLAY_QUERY, {
    variables: { playSlug: '', playbookSlug: curriculumSlug },
    context: { headers: { 'Accept-Language': router.locale } }
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
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <CurriculumModuleForm curriculum={curriculum} />
    </div>
  )
}

export { CreateDpiCurriculumModule, EditDpiCurriculumModule }
