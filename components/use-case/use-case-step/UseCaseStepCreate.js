import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import Breadcrumb from '../../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { USE_CASE_DETAIL_QUERY } from '../../shared/query/useCase'
import UseCaseStepForm from './fragments/UseCaseStepForm'
import UseCaseStepCreateLeft from './UseCaseStepCreateLeft'

const UseCaseStepCreate = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(USE_CASE_DETAIL_QUERY, {
    variables: { slug },
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
  } else if (!data?.useCase) {
    return handleMissingData()
  }

  const { useCase } = data

  const slugNameMapping = () => {
    const map = {
      create: format('app.create')
    }
    map[useCase.slug] = useCase.name

    return map
  }

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping()}/>
      </div>
      <div className='flex flex-row'>
        <div className='basis-1/3'>
          <UseCaseStepCreateLeft useCase={useCase} />
        </div>
        <div className='basis-2/3'>
          <UseCaseStepForm useCase={useCase} />
        </div>
      </div>
    </div>
  )
}

export default UseCaseStepCreate
