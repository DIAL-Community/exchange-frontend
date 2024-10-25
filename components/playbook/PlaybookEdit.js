import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { PLAYBOOK_DETAIL_QUERY } from '../shared/query/playbook'
import PlaybookForm from './fragments/PlaybookForm'
import PlaybookEditLeft from './PlaybookEditLeft'

const PlaybookEdit = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(PLAYBOOK_DETAIL_QUERY, {
    variables: { slug, owner: 'public' },
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
  } else if (!data?.playbook) {
    return handleMissingData()
  }

  const { playbook } = data

  const slugNameMapping = (() => {
    const map = {
      edit: format('app.edit')
    }
    map[playbook.slug] = playbook.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <PlaybookEditLeft playbook={playbook} />
        </div>
        <div className='lg:basis-2/3'>
          <PlaybookForm playbook={playbook} />
        </div>
      </div>
    </div>
  )
}

export default PlaybookEdit
