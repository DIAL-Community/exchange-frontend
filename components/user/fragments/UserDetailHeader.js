import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const UserDetailHeader = ({ user }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-stratos font-semibold'>
        {user.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded border'>
        <img
          src='/ui/v1/user-header.svg'
          alt={format('ui.image.logoAlt', { name: format('ui.user.label') })}
          className='object-contain w-12 h-12 mx-auto'
        />
      </div>
    </div>
  )
}

export default UserDetailHeader
