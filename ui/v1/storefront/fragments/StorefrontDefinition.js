import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'

const StorefrontDefinition = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-6 py-4'>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-plum'>
          {format('organization.hint.title')}
        </div>
        <div className='text-sm text-dial-stratos'>
          {format('organization.hint.subtitle')}
        </div>
      </div>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-plum'>
          {format('organization.hint.characteristicTitle')}
        </div>
        <div className='text-sm text-dial-stratos fr-view'>
          {parse(format('organization.hint.characteristics'))}
        </div>
      </div>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-plum'>
          {format('organization.hint.descriptionTitle')}
        </div>
        <div className='text-sm text-dial-stratos'>
          {parse(format('organization.hint.description'))}
        </div>
      </div>
    </div>
  )
}

export default StorefrontDefinition
