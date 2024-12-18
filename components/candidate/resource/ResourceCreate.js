import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { CREATING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import Breadcrumb from '../../shared/Breadcrumb'
import { handleLoadingQuery, handleQueryError } from '../../shared/GraphQueryHandler'
import { CANDIDATE_RESOURCE_POLICY_QUERY } from '../../shared/query/candidateResource'
import ResourceForm from './fragments/ResourceForm'
import ResourceSimpleLeft from './fragments/ResourceSimpleLeft'

const ResourceCreate = ({ country }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error } = useQuery(CANDIDATE_RESOURCE_POLICY_QUERY, {
    variables: { slug: CREATING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  }

  const slugNameMapping = (() => {
    const map = {
      create: format('app.create')
    }

    if (country) {
      map['countries'] = format('hub.breadcrumb.country')
      map[country.slug] = country.name
    }

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-spearmint text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <ResourceSimpleLeft />
        </div>
        <div className='lg:basis-2/3'>
          <ResourceForm country={country} />
        </div>
      </div>
    </div>
  )
}

export default ResourceCreate
