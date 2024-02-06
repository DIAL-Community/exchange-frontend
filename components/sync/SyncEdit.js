import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { SYNC_DETAIL_QUERY } from '../shared/query/sync'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import SyncForm from './fragments/SyncForm'
import SyncEditLeft from './SyncEditLeft'

const SyncEdit = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(SYNC_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.sync) {
    return <NotFound />
  }

  const { sync } = data

  const slugNameMapping = (() => {
    const map = {
      edit: format('app.edit')
    }
    map[sync.slug] = sync.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <SyncEditLeft sync={sync} />
        </div>
        <div className='lg:basis-2/3'>
          <SyncForm sync={sync} />
        </div>
      </div>
    </div>
  )
}

export default SyncEdit
