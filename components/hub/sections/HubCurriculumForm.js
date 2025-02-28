import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { CREATING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PLAYBOOK_DETAIL_QUERY, PLAYBOOK_POLICY_QUERY } from '../../shared/query/playbook'
import { DPI_TENANT_NAME } from '../constants'
import CurriculumForm from '../curriculum/forms/CurriculumForm'
import HubBreadcrumb from './HubBreadcrumb'

const EditHubCurriculum = ({ curriculumSlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale } = useRouter()

  const { data, loading, error } = useQuery(PLAYBOOK_DETAIL_QUERY, {
    variables: { slug: curriculumSlug, owner: DPI_TENANT_NAME },
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
      <CurriculumForm curriculum={curriculum} />
    </div>
  )
}

const CreateHubCurriculum = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale } = useRouter()

  const { data, loading, error } = useQuery(PLAYBOOK_POLICY_QUERY, {
    variables: { slug: CREATING_POLICY_SLUG, owner: DPI_TENANT_NAME },
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

  const slugNameMapping = () => {
    const map = {
      create: format('app.create')
    }

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
      <CurriculumForm />
    </div>
  )
}

export { CreateHubCurriculum, EditHubCurriculum }
