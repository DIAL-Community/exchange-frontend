import { useCallback } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { IoClose } from 'react-icons/io5'
import { DisplayType } from '../../utils/constants'
import { useUser } from '../../../../lib/hooks'

const OrganizationCard = ({ displayType, index, organization, dismissCardHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [submitter] = organization.contacts

  const { user } = useUser()
  const submitterEmail = user
    ? submitter?.email ?? format('general.na')
    : format('general.hidden')

  const bgColor = `${organization.rejected}`.toLowerCase() === 'true'
    ? 'bg-red-700'
    : 'bg-green-700'
  const candidateStatus = `${organization.rejected}`.toLowerCase() === 'true'
    ? format('candidate.rejected')
    : format('candidate.approved')

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[13.5rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='w-20 h-20 mx-auto'>
          <img
            src='/ui/v1/organization-header.svg'
            alt={format('ui.image.logoAlt', { name: format('ui.candidateOrganization.label') })}
            className='object-contain w-16 h-16'
          />
        </div>
        {organization.rejected !== null &&
          <div className={`absolute top-2 right-2 ${bgColor} rounded`}>
            <div className='text-white text-xs px-2 py-1'>{candidateStatus}</div>
          </div>
        }
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {organization.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {organization?.description && parse(organization?.description)}
          </div>
          <div className='flex flex-col gap-1'>
            <div className='line-clamp-1 text-xs italic'>
              {`${format('ui.candidate.submitter')}: ${submitterEmail}`}
            </div>
            <div className='text-xs italic'>
              <span className='pr-[2px]'>{format('ui.candidate.submittedOn')}:</span>
              <FormattedDate value={organization.createdAt} />
            </div>
          </div>
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/candidate/organizations/${organization.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
      </Link>
      {dismissCardHandler && {}.toString.call(dismissCardHandler) === '[object Function]' &&
        <button className='absolute p-2 top-0 right-0 text-dial-sapphire'>
          <IoClose size='1rem' onClick={dismissCardHandler} />
        </button>
      }
    </div>
  )
}

export default OrganizationCard
