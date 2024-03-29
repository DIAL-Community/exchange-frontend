import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'

const BuildingBlockDefinition = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-6 py-4'>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-ochre'>
          {format('buildingBlock.hint.title')}
        </div>
        <div className='text-sm text-dial-stratos'>
          {format('buildingBlock.hint.subtitle')}
        </div>
      </div>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-ochre'>
          {format('buildingBlock.hint.characteristicTitle')}
        </div>
        <div className='text-sm text-dial-stratos fr-view'>
          {parse(format('buildingBlock.hint.characteristics'))}
        </div>
      </div>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xl font-semibold text-dial-ochre'>
          {format('buildingBlock.hint.descriptionTitle')}
        </div>
        <div className='text-sm text-dial-stratos'>
          {format('buildingBlock.hint.description')}
        </div>
      </div>
    </div>
  )
}

export default BuildingBlockDefinition
