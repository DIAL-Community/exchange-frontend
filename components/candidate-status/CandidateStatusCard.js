import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { FaXmark } from 'react-icons/fa6'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const CandidateStatusCard = ({ displayType, index, candidateStatus, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[8rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='flex flex-col gap-y-3 w-full'>
          <div className='flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-items-center'>
            <div className='text-lg font-semibold'>
              {candidateStatus.name}
            </div>
            {candidateStatus.terminalStatus &&
              <span className='bg-dial-plum text-white px-2 py-1 rounded text-xs'>
                {format('ui.candidateStatus.terminalStatus.label')}
              </span>
            }
            {candidateStatus.initialStatus &&
              <span className='bg-dial-iris-blue text-white px-3 py-1 rounded text-xs'>
                {format('ui.candidateStatus.initialStatus.label')}
              </span>
            }
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {candidateStatus?.description && parse(candidateStatus?.description)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.candidateStatus.nextCandidateStatus.header')}&nbsp;
              ({candidateStatus.nextCandidateStatuses?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-candidateStatus-bg-light to-candidateStatus-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        <div className='text-sm font-semibold text-dial-plum my-auto'>
          {candidateStatus.name}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/candidate-statuses/${candidateStatus.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      </Link>
      {isValidFn(dismissHandler) &&
        <button type='button' className='absolute top-2 right-2'>
          <FaXmark size='1rem' className='text-dial-plum' onClick={dismissHandler} />
        </button>
      }
    </div>
  )
}

export default CandidateStatusCard
