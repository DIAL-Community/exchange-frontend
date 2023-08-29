import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'

const SdgDefinition = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-6 py-4'>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-plum'>
          {format('sdg.hint.title')}
        </div>
        <div className='text-sm text-dial-stratos'>
          {format('sdg.hint.subtitle')}
        </div>
      </div>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-plum'>
          {format('sdg.hint.descriptionTitle')}
        </div>
        <div className='text-sm text-dial-stratos'>
          {parse(format('sdg.hint.description'))}
        </div>
      </div>
    </div>
  )
}

export default SdgDefinition
