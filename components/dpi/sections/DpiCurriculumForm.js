import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PLAYBOOK_DETAIL_QUERY } from '../../shared/query/playbook'
import CurriculumForm from '../curriculum/forms/CurriculumForm'

const EditDpiCurriculum = ({ curriculumSlug }) => {
  const router = useRouter()

  const { data, loading, error } = useQuery(PLAYBOOK_DETAIL_QUERY, {
    variables: { slug: curriculumSlug },
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
      <CurriculumForm curriculum={curriculum} />
    </div>
  )
}

const CreateDpiCurriculum = () => {
  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <CurriculumForm />
    </div>
  )
}

export { CreateDpiCurriculum, EditDpiCurriculum }
