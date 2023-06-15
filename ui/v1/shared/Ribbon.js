import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const Ribbon = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='bg-dial-blue-chalk ribbon-outer rounded-b-[32px]'>
      <div className='ribbon-inner'>
        <div className='flex flex-row gap-3 mx-32'>
          <div className='flex gap-2'>
            <img
              src='/ui/v1/use-case-header.png'
              alt='Logo for use case header.'
            />
            {format('useCase.label')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ribbon
