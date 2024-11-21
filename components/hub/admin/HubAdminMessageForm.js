import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { MESSAGE_DETAIL_QUERY } from '../../shared/query/message'
import MessageForm from '../message/MessageForm'
import HubAdminTabs from './HubAdminTabs'

const HubAdminMessageForm = ({ messageSlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, data, error } = useQuery(MESSAGE_DETAIL_QUERY, {
    variables: { slug: messageSlug },
    skip: !messageSlug,
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.EDITING
      }
    }
  })

  return (
    <div className='px-4 lg:px-8 xl:px-56 min-h-[80vh] py-8'>
      <div className='md:flex md:h-full'>
        <HubAdminTabs />
        <div className='text-dial-slate-400 bg-dial-slate-800 rounded-lg w-full h-full'>
          <div className='p-6 lg:p-12'>
            {loading
              ? format('general.fetchingData')
              : error
                ? format('general.fetchError')
                : messageSlug && data.message
                  ? <MessageForm message={data?.message} />
                  : <MessageForm />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default HubAdminMessageForm
