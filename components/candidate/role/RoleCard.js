import { useCallback } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { FaXmark } from 'react-icons/fa6'
import { DisplayType } from '../../utils/constants'
import { useUser } from '../../../lib/hooks'
import { isValidFn } from '../../utils/utilities'

const RoleCard = ({ displayType, index, role, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const submitterEmail = user
    ? role.email ?? format('general.na')
    : format('general.hidden')

  const bgColor = `${role.rejected}`.toLowerCase() === 'true'
    ? 'bg-red-700'
    : 'bg-green-700'
  const candidateStatus = `${role.rejected}`.toLowerCase() === 'true'
    ? format('candidate.rejected')
    : format('candidate.approved')

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[13.5rem] ${index % 2 === 0 && 'bg-dial-spearmint'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='w-20 h-20 mx-auto'>
          <img
            src='/ui/v1/role-header.svg'
            alt={format('ui.image.logoAlt', { name: format('ui.candidateRole.label') })}
            className='object-contain w-16 h-16'
          />
        </div>
        {role.rejected !== null &&
          <div className={`absolute top-2 right-2 ${bgColor} rounded`}>
            <div className='text-white text-xs px-2 py-1'>{candidateStatus}</div>
          </div>
        }
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-meadow'>
            {role.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {role?.description && parse(role?.description)}
          </div>
          <div className='flex flex-col gap-1'>
            <div className='line-clamp-1 text-xs italic'>
              {`${format('ui.candidate.submitter')}: ${submitterEmail}`}
            </div>
            <div className='text-xs italic'>
              <span className='pr-[2px]'>{format('ui.candidate.submittedOn')}:</span>
              <FormattedDate value={role.createdAt} />
            </div>
          </div>
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/candidate/roles/${role.id}`}>
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

export default RoleCard
