import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const ContactCard = ({ displayType, index, contact, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[7rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='w-20 h-20 mx-auto'>
          <img
            src='/ui/v1/user-header.svg'
            alt={format('ui.image.logoAlt', { name: format('ui.contact.label') })}
            className='object-contain w-16 h-16'
          />
        </div>
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {contact.name}
          </div>
          <div className='flex flex-col gap-y-1'>
            <div className='text-sm text-dial-stratos'>
              {contact.email ?? format('general.na')}
            </div>
            <div className='text-sm text-dial-stratos'>
              {contact.title ?? format('general.na')}
            </div>
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.organization.header')} ({contact.organizations?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-workflow-bg-light to-workflow-bg h-24'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        <img
          src='/ui/v1/user-header.svg'
          alt={format('ui.image.logoAlt', { name: format('ui.contact.header') })}
          className='object-contain w-10 h-10 my-auto'
        />
        <div className='flex flex-col gap-y-2 py-3 text-dial-stratos'>
          <div className='text-sm font-semibold text-dial-iris-blue'>
            {contact.name}
          </div>
          <div className='text-xs line-clamp-1'>
            {contact.email}
          </div>
          <div className='text-xs line-clamp-1'>
            {contact.title}
          </div>
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/contacts/${contact.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      </Link>
      { isValidFn(dismissHandler) &&
        <button type='button' className='absolute p-2 top-0 right-0 text-dial-sapphire'>
          <FaXmark size='1rem' className='text-dial-plum' onClick={dismissHandler} />
        </button>
      }
    </div>
  )
}

export default ContactCard
