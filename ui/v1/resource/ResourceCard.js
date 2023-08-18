import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { IoClose } from 'react-icons/io5'
import { DisplayType } from '../utils/constants'

const ResourceCard = ({ displayType, index, resource, dismissCardHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[7rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='w-20 h-20 mx-auto'>
          <img
            src='/ui/v1/resource-header.svg'
            alt={format('ui.image.logoAlt', { name: format('ui.resource.label') })}
            className='object-contain w-16 h-16'
          />
        </div>
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {resource.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {resource?.description && parse(resource?.description)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.organization.header')} ({resource.organizations?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-workflow-bg-light to-workflow-bg h-24'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        <img
          src='/ui/v1/resource-header.svg'
          alt={format('ui.image.logoAlt', { name: format('ui.resource.header') })}
          className='object-contain w-10 h-10 my-auto'
        />
        <div className='flex flex-col gap-y-2 py-3 text-dial-stratos'>
          <div className='text-sm font-semibold text-dial-iris-blue'>
            {resource.name}
          </div>
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/resources/${resource.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      </Link>
      {dismissCardHandler && {}.toString.call(dismissCardHandler) === '[object Function]' &&
        <button className='absolute p-2 top-0 right-0 text-dial-sapphire'>
          <IoClose size='1rem' onClick={dismissCardHandler} />
        </button>
      }
    </div>
  )
}

export default ResourceCard
