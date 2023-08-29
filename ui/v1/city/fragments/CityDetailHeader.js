import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const CityDetailHeader = ({ city }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-plum font-semibold'>
        {city.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded border'>
        <div className='w-20 h-20 mx-auto'>
          <img
            src='/ui/v1/map-header.svg'
            alt={format('ui.image.logoAlt', { name: format('ui.city.label') })}
            className='object-contain w-16 h-16'
          />
        </div>
      </div>
    </div>
  )
}

export default CityDetailHeader
