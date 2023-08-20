import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { IoClose } from 'react-icons/io5'
import { DisplayType } from '../utils/constants'

const StorefrontCard = ({ displayType, index, organization, dismissCardHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[13.5rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        {organization.imageFile.indexOf('placeholder.png') < 0 &&
          <div className='w-20 h-20 mx-auto bg-white border'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.storefront.label') })}
              className='object-contain w-16 h-16 mx-auto my-2'
            />
          </div>
        }
        {organization.imageFile.indexOf('placeholder.png') >= 0 &&
          <div className='w-20 h-20 mx-auto bg-dial-plum rounded-full'>
            <img
              src='/ui/v1/storefront-header.svg'
              alt={format('ui.image.logoAlt', { name: format('ui.storefront.label') })}
              className='object-contain w-10 h-10 mx-auto mt-4 white-filter'
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
              {format('ui.sector.header')} ({organization.sectors?.length ?? 0})
            </div>
            <div className='border-r border-dial-stratos-400' />
            <div className='text-sm'>
              {format('ui.country.header')} ({organization.countries?.length ?? 0})
            </div>
            <div className='border-r border-dial-stratos-400' />
            <div className='text-sm'>
              {format('ui.project.header')} ({organization.projects?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-workflow-bg-light to-workflow-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        {organization.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='rounded-full bg-dial-plum w-10 h-10 min-w-[2.5rem]'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.storefront.header') })}
              className='object-contain w-10 h-10 my-auto'
            />
          </div>
        }
        {organization.imageFile.indexOf('placeholder.svg') < 0 &&
          <img
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
            alt={format('ui.image.logoAlt', { name: format('ui.storefront.header') })}
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
      <Link href={`/storefronts/${organization.slug}`}>
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

export default StorefrontCard