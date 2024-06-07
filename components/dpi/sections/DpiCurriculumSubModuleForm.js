import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { MOVE_QUERY } from '../../shared/query/move'
import { PLAY_QUERY } from '../../shared/query/play'
import { DPI_TENANT_NAME } from '../constants'
import CurriculumSubModuleForm from '../curriculum/forms/CurriculumSubModuleForm'
import DpiBreadcrumb from './DpiBreadcrumb'

const EditDpiCurriculumSubModule = ({ curriculumSlug, curriculumModuleSlug, curriculumSubModuleSlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  const { loading, error, data } = useQuery(MOVE_QUERY, {
    variables: {
      moveSlug: curriculumSubModuleSlug,
      playSlug: curriculumModuleSlug,
      playbookSlug: curriculumSlug,
      owner: DPI_TENANT_NAME
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

  const slugNameMapping = (() => {
    const map = {
      edit: format('app.edit')
    }
    map[curriculum.slug] = curriculum.name
    map[curriculumModule.slug] = curriculumModule.name
    map[curriculumSubModule.slug] = curriculumSubModule.name

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
      <CurriculumSubModuleForm
        curriculum={curriculum}
        curriculumModule={curriculumModule}
        curriculumSubModule={curriculumSubModule}
      />
    </div>
  )
}

const CreateDpiCurriculumSubModule = ({ curriculumSlug, curriculumModuleSlug }) => {
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

  const {
    playbook: curriculum,
    play: curriculumModule
  } = data

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
      <CurriculumSubModuleForm
        curriculum={curriculum}
        curriculumModule={curriculumModule}
      />
    </div>
  )
}

export { CreateDpiCurriculumSubModule, EditDpiCurriculumSubModule }
