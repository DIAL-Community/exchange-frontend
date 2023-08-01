import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { IoClose } from 'react-icons/io5'
import { DisplayType, REBRAND_BASE_PATH } from '../utils/constants'

const OrganizationCard = ({ displayType, index, organization, dismissCardHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        {organization.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='w-20 h-20 mx-auto bg-white border'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
              className='object-contain w-16 h-16 mx-auto my-2'
            />
          </div>
        }
        {organization.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-20 h-20 mx-auto'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
              className='object-contain w-16 h-16'
            />
          </div>
        }
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {organization.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {organization?.organizationDescription && parse(organization?.organizationDescription.description)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.sdg.header')} ({organization.sustainableDevelopmentGoals?.length ?? 0})
            </div>
            <div className='border border-r text-dial-stratos-300' />
            <div className='text-sm'>
              {format('ui.buildingBlock.header')} ({organization.buildingBlocks?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-organization-bg-light to-organization-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        {organization.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='rounded-full bg-dial-plum w-10 h-10 min-w-[2.5rem]'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.organization.header') })}
              className='object-contain w-10 h-10 my-auto'
            />
          </div>
        }
        {organization.imageFile.indexOf('placeholder.svg') < 0 &&
          <img
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
            alt={format('ui.image.logoAlt', { name: format('ui.organization.header') })}
            className='object-contain w-10 h-10 my-auto min-w-[2.5rem]'
          />
        }
        <div className='text-sm font-semibold text-dial-plum my-auto'>
          {organization.name}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`${REBRAND_BASE_PATH}/organizations/${organization.slug}`}>
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

export default OrganizationCard
