import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { prependUrlWithProtocol } from '../../../utils/utilities'

const DatasetDetailHeader = ({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-meadow font-semibold'>
        {dataset.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded border'>
        <img
          src='/ui/v1/dataset-header.svg'
          alt={format('ui.image.logoAlt', { name: format('ui.candidateDataset.label') })}
          className='object-contain w-16 h-16'
        />
      </div>
      <div className='flex flex-col gap-y-8 text-sm pt-6 pb-3'>
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-meadow'>
            {format('dataset.website')}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <a
              href={prependUrlWithProtocol(dataset.website)}
              target='_blank'
              rel='noreferrer'
              className='flex border-b border-dial-iris-blue '>
              <div className='line-clamp-1'>
                {dataset.website}
              </div>
            </a>
            ⧉
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatasetDetailHeader
