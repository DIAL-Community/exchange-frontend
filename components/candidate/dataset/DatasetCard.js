import { useCallback } from 'react'
import parse from 'html-react-parser'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { FormattedDate, useIntl } from 'react-intl'
import { DisplayType } from '../../utils/constants'
import { isValidFn } from '../../utils/utilities'

const DatasetCard = ({ displayType, index, dataset, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const submitterEmail = dataset.submitterEmail ?? format('general.na')
  const bgColor = `${dataset.rejected}`.toLowerCase() === 'true'
    ? 'bg-red-700'
    : `${dataset.rejected}`.toLowerCase() === 'false'
      ? 'bg-green-700'
      : 'bg-dial-iris-blue'
  const candidateStatus = `${dataset.rejected}`.toLowerCase() === 'true'
    ? format('candidate.rejected')
    : `${dataset.rejected}`.toLowerCase() === 'false'
      ? format('candidate.approved')
      : format('candidate.inReview')

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[13.5rem] ${index % 2 === 0 && 'bg-dial-spearmint'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='w-20 h-20 mx-auto'>
          <img
            src='/ui/v1/dataset-header.svg'
            alt={format('ui.image.logoAlt', { name: format('ui.candidateDataset.label') })}
            className='object-contain w-16 h-16'
          />
        </div>
        <div className={`absolute top-2 right-2 ${bgColor} rounded`}>
          <div className='text-white text-xs px-2 py-1'>{candidateStatus}</div>
        </div>
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-meadow line-clamp-1'>
            {dataset.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {dataset?.description && parse(dataset?.description)}
          </div>
          <div className='flex flex-col gap-1'>
            <div className='line-clamp-1 text-xs italic'>
              {`${format('ui.candidate.submitter')}: ${submitterEmail}`}
            </div>
            <div className='text-xs italic'>
              <span className='pr-[2px]'>{format('ui.candidate.submittedOn')}:</span>
              <FormattedDate value={dataset.createdAt} />
            </div>
          </div>
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/candidate/datasets/${dataset.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
      </Link>
      { isValidFn(dismissHandler) &&
        <button type='button' className='absolute top-2 right-2'>
          <FaXmark size='1rem' className='text-dial-plum' onClick={dismissHandler} />
        </button>
      }
    </div>
  )
}

export default DatasetCard
