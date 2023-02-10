import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import parse from 'html-react-parser'
import Image from 'next/image'

const UseCaseHint = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col text-dial-stratos'>
      <div className='text-xl font-semibold'>
        {format('useCase.label')}
      </div>
      <div className='text-base'>
        {format('useCase.hint.subtitle')}
      </div>
      <div className='mx-auto'>
        <Image
          height={200}
          width={200}
          src='/images/tiles/use-case.svg'
          alt='Use case hint logo.' />
      </div>
      <div className='text-lg'>
        {format('useCase.hint.characteristicTitle').toUpperCase()}
      </div>
      <div className='fr-view text-sm'>
        {parse(format('useCase.hint.characteristics'))}
      </div>
      <div className='text-lg'>
        {format('useCase.hint.descriptionTitle').toUpperCase()}
      </div>
      <div className='text-sm'>
        {format('useCase.hint.description')}
      </div>
    </div>
  )
}

export default UseCaseHint
