import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import parse from 'html-react-parser'
import Image from 'next/image'

const BuildingBlockHint = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-2 text-dial-stratos'>
      <div className='text-xl font-semibold'>
        {format('ui.buildingBlock.label')}
      </div>
      <div className='text-base'>
        {format('buildingBlock.hint.subtitle')}
      </div>
      <div className='mx-auto'>
        <Image
          height={200}
          width={200}
          src='/images/tiles/building-block.svg'
          alt='Building block hint logo.' />
      </div>
      <div className='text-lg'>
        {format('buildingBlock.hint.characteristicTitle').toUpperCase()}
      </div>
      <div className='fr-view text-sm'>
        {parse(format('buildingBlock.hint.characteristics'))}
      </div>
      <div className='text-lg'>
        {format('buildingBlock.hint.descriptionTitle').toUpperCase()}
      </div>
      <div className='text-sm'>
        {format('buildingBlock.hint.description')}
      </div>
    </div>
  )
}

export default BuildingBlockHint
