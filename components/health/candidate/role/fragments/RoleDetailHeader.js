import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const RoleDetailHeader = ({ role }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-meadow font-semibold'>
        {role.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded border-health-red border-4'>
        <div className='w-20 h-20'>
          <img
            src='/ui/v1/role-header.svg'
            alt={format('ui.image.logoAlt', { name: format('ui.candidateRole.label') })}
            className='object-contain dial-meadow-filter'
          />
        </div>
      </div>
    </div>
  )
}

export default RoleDetailHeader
