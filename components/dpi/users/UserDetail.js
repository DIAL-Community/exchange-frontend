import { useCallback } from 'react'
import { FormattedDate, FormattedTime, useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import EditButton from '../../shared/form/EditButton'

const UserDetail = ({ user }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user: loggedInUser } = useUser()

  const editPath = `${user.id}/edit`

  return (
    <div className='relative flex flex-col gap-y-3'>
      {(loggedInUser.isAdliAdminUser || loggedInUser.isAdminUser) && (
        <div className='absolute top-1 -right-1'>
          <EditButton type='link' href={editPath} />
        </div>
      )}
      <div className='text-xl font-semibold py-3'>
        {format('ui.common.detail.description')}
      </div>
      <div className='block'>
        {user.email}
      </div>
      <hr className='border-b border-dial-blue-chalk my-3' />
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold pb-3'>
          {format('user.roles')}
        </div>
        <div className='text-sm'>
          {user?.roles.map(x => x.toUpperCase()).join(', ')}
        </div>
      </div>
      <hr className='border-b border-dial-blue-chalk my-3' />
      <div className='flex flex-col gap-y-3'>
        <div className='font-semibold'>
          {format('ui.user.accountDetails')}
        </div>
        <div className='text-xs italic'>
          {format('ui.user.createdAt')}:&nbsp;
          <FormattedDate value={user.createdAt} />&nbsp;
          <FormattedTime value={user.createdAt} />
        </div>
        {`${user.confirmed}` === 'true' &&
          <div className='text-xs italic'>
            {format('ui.user.confirmedAt')}:&nbsp;
            <FormattedDate value={user.confirmedAt} />&nbsp;
            <FormattedTime value={user.confirmedAt} />
          </div>
        }
      </div>
    </div>
  )
}

export default UserDetail
