import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import parse from 'html-react-parser'
import Image from 'next/image'

const DatasetHint = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-2 text-dial-stratos'>
      <div className='text-xl font-semibold'>
        {format('dataset.label')}
      </div>
      <div className='text-base'>
        {format('dataset.hint.subtitle')}
      </div>
      <div className='mx-auto'>
        <Image
          height={200}
          width={200}
          src='/images/placeholders/dataset.png'
          alt='Dataset hint logo.' />
      </div>
      <div className='text-lg font-semibold'>
        {format('dataset.hint.descriptionTitle').toUpperCase()}
      </div>
      <div className='text-sm'>
        {parse(format('dataset.hint.description'))}
      </div>
    </div>
  )
}

export default DatasetHint
