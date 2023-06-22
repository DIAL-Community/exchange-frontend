import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'

const UseCaseDefinition = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-6 py-8'>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-blueberry'>
          {format('useCase.hint.title')}
        </div>
        <div className='text-sm text-dial-stratos'>
          {format('useCase.hint.subtitle')}
        </div>
      </div>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-blueberry'>
          {format('useCase.hint.characteristicTitle')}
        </div>
        <div className='text-sm text-dial-stratos fr-view'>
          {parse(format('useCase.hint.characteristics'))}
        </div>
      </div>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-blueberry'>
          {format('useCase.hint.descriptionTitle')}
        </div>
        <div className='text-sm text-dial-stratos'>
          {format('useCase.hint.description')}
        </div>
      </div>
    </div>
  )
}

export default UseCaseDefinition
