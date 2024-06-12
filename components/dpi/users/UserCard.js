import { useCallback } from 'react'
import Link from 'next/link'
import { FormattedDate, useIntl } from 'react-intl'

const UserCard = ({ user }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className='px-4 py-6 rounded-lg'>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-base font-semibold'>
            {user.email}
          </div>
          <div className='line-clamp-4 text-sm'>
            {user?.roles.map(x => x.toUpperCase()).join(', ')}
          </div>
          <div className='line-clamp-1 text-xs italic'>
            {format('ui.user.confirmedAt')}:&nbsp;
            {user.confirmedAt ? <FormattedDate value={user.confirmedAt} /> : format('general.na')}
          </div>
        </div>
      </div>
    </div>

  return (
    <Link href={`/dpi-admin/users/${user.id}`}>
      {displayLargeCard()}
    </Link>
  )
}

export default UserCard
