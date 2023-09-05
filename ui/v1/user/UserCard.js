import { useCallback } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const UserCard = ({ displayType, index, user, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-base font-semibold text-dial-stratos'>
            {user.email}
          </div>
          <div className='line-clamp-4 text-dial-stratos text-sm'>
            {user?.roles.map(x => x.toUpperCase()).join(', ')}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.product.header')} ({user.products?.length ?? 0})
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.organization.label')}: {user.organization?.name ?? format('general.na')}
            </div>
          </div>
          <div className='line-clamp-1 text-xs italic text-dial-sapphire'>
            {format('ui.user.confirmedAt')}:&nbsp;
            {user.confirmedAt ? <FormattedDate value={user.confirmedAt} /> : format('general.na')}
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-user-bg-light to-user-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        <div className='text-sm font-semibold text-dial-stratos my-auto'>
          {user.name}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/users/${user.id}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      </Link>
      { isValidFn(dismissHandler) &&
        <button type='button' className='absolute top-2 right-2'>
          <FaXmark size='1rem' className='text-dial-stratos' onClick={dismissHandler} />
        </button>
      }
    </div>
  )
}

export default UserCard
