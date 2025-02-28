import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { allowedToBrowseAdliPages } from '../admin/utilities'
import ProfileDetail from '../user/ProfileDetail'
import HubBreadcrumb from './HubBreadcrumb'

const HubProfileDetail = ({ user }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slugNameMapping = () => {
    const map = {
      'dashboard': allowedToBrowseAdliPages(user)
        ? format('hub.breadcrumb.dashboard.adli')
        : format('hub.breadcrumb.dashboard')
    }

    return map
  }

  return (
    <div className='md:px-4 lg:px-8 xl:px-24 3xl:px-56 min-h-[80vh]'>
      <div
        className='py-4 px-6 sticky bg-dial-blue-chalk text-dial-stratos'
        style={{ top: 'var(--header-height)' }}
      >
        <HubBreadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='md:flex md:h-full'>
        <div className='text-dial-sapphire rounded-lg w-full h-full'>
          <div className='p-6 lg:p-12'>
            <ProfileDetail user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HubProfileDetail
