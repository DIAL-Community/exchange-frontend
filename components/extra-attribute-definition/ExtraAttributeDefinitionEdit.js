import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { EXTRA_ATTRIBUTE_DEFINITION_DETAIL_QUERY } from '../shared/query/extraAttributeDefinition'
import ExtraAttributeDefinitionEditLeft from './ExtraAttributeDefinitionEditLeft'
import ExtraAttributeDefinitionForm from './fragments/ExtraAttributeDefinitionForm'

const ExtraAttributeDefinitionEdit = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(EXTRA_ATTRIBUTE_DEFINITION_DETAIL_QUERY, {
    variables: { slug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.EDITING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.extraAttributeDefinition) {
    return handleMissingData()
  }

  const { extraAttributeDefinition } = data

  const slugNameMapping = () => {
    const map = {
      edit: format('app.edit')
    }
    map[extraAttributeDefinition.slug] = extraAttributeDefinition.name

    return map
  }

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping()}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <ExtraAttributeDefinitionEditLeft extraAttributeDefinition={extraAttributeDefinition} />
        </div>
        <div className='lg:basis-2/3'>
          <ExtraAttributeDefinitionForm extraAttributeDefinition={extraAttributeDefinition} />
        </div>
      </div>
    </div>
  )
}

export default ExtraAttributeDefinitionEdit
