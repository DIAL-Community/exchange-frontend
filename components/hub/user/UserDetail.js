import { useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FiEdit3 } from 'react-icons/fi'
import { FormattedDate, FormattedTime, useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'

const UserDetail = ({ user }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user: loggedInUser } = useUser()

  const { asPath } = useRouter()
  const generateEditPath = () => {
    if (asPath.indexOf('/hub/admin/profile') >= 0) {
      return '/hub/admin/profile/edit-user'
    } else {
      return `/hub/admin/users/${user.id}/edit-user`
    }
  }

  return (
    <div className='relative flex flex-col gap-y-3'>
      {(loggedInUser.isAdliAdminUser || loggedInUser.isAdminUser) && (
        <div className='cursor-pointer absolute -top-2 -right-1'>
          <Link href={generateEditPath()} className='bg-dial-iris-blue px-3 py-2 rounded text-white'>
            <FiEdit3 className='inline pb-0.5' />
            <span className='text-sm px-1'>
              {`${format('app.edit')} ${format('ui.user.label')}`}
            </span>
          </Link>
        </div>
      )}
      <div className='flex flex-col gap-y-3'>
        <div className='font-semibold'>
          {format('user.email')}
        </div>
        <div className='description-block'>
          {user.email ?? user.userEmail}
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
