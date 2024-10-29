import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { PLAY_QUERY } from '../shared/query/play'
import MoveForm from './fragments/MoveForm'
import MoveEditLeft from './MoveEditLeft'

const MoveCreate = ({ playSlug, playbookSlug, locale }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(PLAY_QUERY, {
    variables: { playSlug, playbookSlug, owner: 'public' },
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

  const { play, playbook } = data

  const slugNameMapping = (() => {
    const map = {
      edit: format('app.create'),
      create: format('app.create')
    }

    map[play?.slug] = play?.name
    map[playbook?.slug] = playbook?.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-spearmint text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='hidden lg:block basis-1/3'>
          <MoveEditLeft />
        </div>
        <div className='lg:basis-2/3 shrink-0'>
          <MoveForm play={play} playbook={playbook} />
        </div>
      </div>
    </div>
  )
}

export default MoveCreate
