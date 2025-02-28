import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PLAY_QUERY } from '../../shared/query/play'
import { DPI_TENANT_NAME } from '../constants'
import CurriculumModuleForm from '../curriculum/forms/CurriculumModuleForm'
import HubBreadcrumb from './HubBreadcrumb'

const EditHubCurriculumModule = ({ curriculumSlug, curriculumModuleSlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale } = useRouter()

  const { loading, error, data } = useQuery(PLAY_QUERY, {
    variables: { playSlug: curriculumModuleSlug, playbookSlug: curriculumSlug, owner: DPI_TENANT_NAME },
    context: {
      headers: {
        'Accept-Language': locale,
        ...GRAPH_QUERY_CONTEXT.EDITING
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

  const { playbook: curriculum, play: curriculumModule } = data

  const slugNameMapping = () => {
    const map = {
      edit: format('app.edit')
    }
    map[curriculum.slug] = curriculum.name
    map[curriculumModule.slug] = curriculumModule.name

    return map
  }

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div
        className='py-4 px-6 sticky bg-dial-blue-chalk text-dial-stratos'
        style={{ top: 'var(--header-height)' }}
      >
        <HubBreadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <CurriculumModuleForm curriculum={curriculum} curriculumModule={curriculumModule} />
    </div>
  )
}

const CreateHubCurriculumModule = ({ curriculumSlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale } = useRouter()

  const { loading, error, data } = useQuery(PLAY_QUERY, {
    variables: { playSlug: '', playbookSlug: curriculumSlug, owner: DPI_TENANT_NAME },
    context: {
      headers: {
        'Accept-Language': locale,
        ...GRAPH_QUERY_CONTEXT.CREATING
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

  const slugNameMapping = () => {
    const map = {
      edit: format('app.edit')
    }
    map[curriculum.slug] = curriculum.name

    return map
  }

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div
        className='py-4 px-6 sticky bg-dial-blue-chalk text-dial-stratos'
        style={{ top: 'var(--header-height)' }}
      >
        <HubBreadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <CurriculumModuleForm curriculum={curriculum} />
    </div>
  )
}

export { CreateHubCurriculumModule, EditHubCurriculumModule }
