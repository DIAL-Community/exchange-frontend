import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { SIMPLE_USER_DETAIL_QUERY } from '../../shared/query/user'
import ProfileDetail from '../users/ProfileDetail'
import DpiBreadcrumb from './DpiBreadcrumb'

const DpiProfileDetail = ({ userId }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, data, error } = useQuery(SIMPLE_USER_DETAIL_QUERY, {
    variables: { userId: `${userId}` }
  })

  return (
    <div className='px-4 lg:px-8 xl:px-56 min-h-[80vh]'>
      <div
        className='py-4 px-6 sticky bg-dial-blue-chalk text-dial-stratos'
        style={{ top: 'var(--header-height)' }}
      >
        <DpiBreadcrumb slugNameMapping={{}} />
      </div>
      <div className="md:flex md:h-full">
        <div className="p-12 text-medium text-dial-sapphire rounded-lg w-full h-full">
          {loading
            ? format('general.fetchingData')
            : error
              ? format('general.fetchError')
              : userId && data
                ? <ProfileDetail user={data?.user} />
                : format('app.notFound')
          }
        </div>
      </div>
    </div>
  )
}

export default DpiProfileDetail
