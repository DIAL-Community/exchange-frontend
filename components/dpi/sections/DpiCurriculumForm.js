import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PLAYBOOK_DETAIL_QUERY } from '../../shared/query/playbook'
import CurriculumForm from '../curriculum/forms/CurriculumForm'
import DpiBreadcrumb from './DpiBreadcrumb'

const EditDpiCurriculum = ({ curriculumSlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  const { data, loading, error } = useQuery(PLAYBOOK_DETAIL_QUERY, {
    variables: { slug: curriculumSlug, owner: 'dpi' },
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

  const slugNameMapping = (() => {
    const map = {
      edit: format('app.edit')
    }
    map[curriculum.slug] = curriculum.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div
        className='py-4 px-6 sticky bg-dial-blue-chalk text-dial-stratos'
        style={{ top: 'var(--header-height)' }}
      >
        <DpiBreadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <CurriculumForm curriculum={curriculum} />
    </div>
  )
}

const CreateDpiCurriculum = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slugNameMapping = (() => {
    const map = {
      create: format('app.create')
    }

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div
        className='py-4 px-6 sticky bg-dial-blue-chalk text-dial-stratos'
        style={{ top: 'var(--header-height)' }}
      >
        <DpiBreadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <CurriculumForm />
    </div>
  )
}

export { CreateDpiCurriculum, EditDpiCurriculum }
