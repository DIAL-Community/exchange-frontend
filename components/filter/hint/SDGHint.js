import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Image from 'next/image'

const SDGHint = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-2 text-dial-stratos'>
      <div className='text-xl font-semibold'>
        {format('sdg.shortLabel')}
      </div>
      <div className='text-base'>
        {format('sdg.hint.subtitle')}
      </div>
      <div className='mx-auto'>
        <Image
          height={200}
          width={200}
          src='/images/tiles/sdg.svg'
          alt='SDG hint logo.' />
      </div>
      <div className='text-lg font-semibold'>
        {format('sdg.hint.descriptionTitle').toUpperCase()}
      </div>
      <div className='text-sm'>
        {format('sdg.hint.description')}
      </div>
    </div>
  )
}

export default SDGHint
