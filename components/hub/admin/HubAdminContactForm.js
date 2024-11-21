import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { HUB_CONTACT_DETAIL_QUERY } from '../../shared/query/contact'
import { DPI_TENANT_NAME } from '../constants'
import ContactForm from '../user/ContactForm'
import HubAdminTabs from './HubAdminTabs'

const HubAdminContactForm = ({ userId, userEmail }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, data } = useQuery(HUB_CONTACT_DETAIL_QUERY, {
    variables: { userId: `${userId}`, email: userEmail, source: DPI_TENANT_NAME },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
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
              : userEmail && data?.hubContact
                ? <ContactForm user={data?.user} contact={data?.hubContact} />
                : <ContactForm user={data?.user} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default HubAdminContactForm
