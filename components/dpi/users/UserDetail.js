import { useCallback } from 'react'
import { FormattedDate, FormattedTime, useIntl } from 'react-intl'

const UserDetail = ({ user }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='flex flex-col gap-y-3'>
        <div className='font-semibold'>
          {format('user.email')}
        </div>
        <div className='block'>
          {user.email}
        </div>
      </div>
      <hr className='border-b border-dial-blue-chalk my-3' />
      <div className='flex flex-col gap-y-3'>
        <div className='font-semibold'>
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
