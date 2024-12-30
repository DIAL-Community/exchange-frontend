import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { CREATING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleQueryError } from '../shared/GraphQueryHandler'
import { SECTOR_POLICY_QUERY } from '../shared/query/sector'
import SectorForm from './fragments/SectorForm'
import SectorSimpleLeft from './fragments/SectorSimpleLeft'

const SectorCreate = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error } = useQuery(SECTOR_POLICY_QUERY, {
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

  const slugNameMapping = () => {
    const map = {
      create: format('app.create')
    }

    return map
  }

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping()}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <SectorSimpleLeft />
        </div>
        <div className='lg:basis-2/3'>
          <SectorForm />
        </div>
      </div>
    </div>
  )
}

export default SectorCreate
