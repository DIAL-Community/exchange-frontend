import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { MESSAGE_DETAIL_QUERY } from '../../shared/query/message'
import MessageDetail from '../message/MessageDetail'
import DpiAdminTabs from './DpiAdminTabs'

const DpiAdminMessageDetail = ({ messageSlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, data } = useQuery(MESSAGE_DETAIL_QUERY, {
    variables: { slug: messageSlug }
  })

  return (
    <div className='px-4 lg:px-8 xl:px-56 h-[80vh] py-8'>
      <div className="md:flex md:h-full">
        <DpiAdminTabs />
        <div className="p-12 text-medium text-dial-slate-400 bg-dial-slate-800 rounded-lg w-full h-full">
          {loading && format('general.fetchingData') }
          {messageSlug
            ? data
              ? <MessageDetail message={data?.message} />
              : format('general.fetchError')
            : format('app.notFound')
          }
        </div>
      </div>
    </div>
  )
}

export default DpiAdminMessageDetail
