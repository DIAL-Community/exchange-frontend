import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { MOVE_QUERY } from '../../shared/query/move'
import { PLAY_QUERY } from '../../shared/query/play'
import CurriculumSubModuleForm from '../curriculum/forms/CurriculumSubModuleForm'

const EditDpiCurriculumSubModule = ({ curriculumSlug, curriculumModuleSlug, curriculumSubModuleSlug }) => {
  const router = useRouter()

  const { loading, error, data } = useQuery(MOVE_QUERY, {
    variables: {
      moveSlug: curriculumSubModuleSlug,
      playSlug: curriculumModuleSlug,
      playbookSlug: curriculumSlug
    },
    context: { headers: { 'Accept-Language': router.locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.playbook) {
    return <NotFound />
  }

  const {
    playbook: curriculum,
    play: curriculumModule,
    move: curriculumSubModule
  } = data

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <CurriculumSubModuleForm
        curriculum={curriculum}
        curriculumModule={curriculumModule}
        curriculumSubModule={curriculumSubModule}
      />
    </div>
  )
}

const CreateDpiCurriculumSubModule = ({ curriculumSlug, curriculumModuleSlug }) => {
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

  const {
    playbook: curriculum,
    play: curriculumModule
  } = data

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <CurriculumSubModuleForm
        curriculum={curriculum}
        curriculumModule={curriculumModule}
      />
    </div>
  )
}

export { CreateDpiCurriculumSubModule, EditDpiCurriculumSubModule }
