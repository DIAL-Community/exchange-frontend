import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PLAY_QUERY } from '../../shared/query/play'
import { DPI_TENANT_NAME } from '../constants'
import CurriculumModuleForm from '../curriculum/forms/CurriculumModuleForm'
import DpiBreadcrumb from './DpiBreadcrumb'

const EditDpiCurriculumModule = ({ curriculumSlug, curriculumModuleSlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  const { loading, error, data } = useQuery(PLAY_QUERY, {
    variables: { playSlug: curriculumModuleSlug, playbookSlug: curriculumSlug, owner: DPI_TENANT_NAME },
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

  const slugNameMapping = (() => {
    const map = {
      edit: format('app.edit')
    }
    map[curriculum.slug] = curriculum.name
    map[curriculumModule.slug] = curriculumModule.name

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
      <CurriculumModuleForm curriculum={curriculum} curriculumModule={curriculumModule} />
    </div>
  )
}

const CreateDpiCurriculumModule = ({ curriculumSlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  const { loading, error, data } = useQuery(PLAY_QUERY, {
    variables: { playSlug: '', playbookSlug: curriculumSlug, owner: DPI_TENANT_NAME },
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
      <CurriculumModuleForm curriculum={curriculum} />
    </div>
  )
}

export { CreateDpiCurriculumModule, EditDpiCurriculumModule }
