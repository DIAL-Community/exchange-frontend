import { useCallback } from 'react'
import parse from 'html-react-parser'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const StorefrontCard = ({ displayType, index, storefront, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[13.5rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        {storefront.imageFile.indexOf('placeholder.png') < 0 &&
          <div className='w-20 h-20 mx-auto bg-white border'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + storefront.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.storefront.label') })}
              className='object-contain w-16 h-16 mx-auto my-2'
            />
          </div>
        }
        {storefront.imageFile.indexOf('placeholder.png') >= 0 &&
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
            {storefront.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {storefront?.parsedDescription && parse(storefront?.parsedDescription)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.sector.header')} ({storefront.sectors?.length ?? 0})
            </div>
            <div className='border-r border-dial-stratos-400' />
            <div className='text-sm'>
              {format('ui.country.header')} ({storefront.countries?.length ?? 0})
            </div>
            <div className='border-r border-dial-stratos-400' />
            <div className='text-sm'>
              {format('ui.project.header')} ({storefront.projects?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/storefronts/${storefront.slug}`}>
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

export default StorefrontCard
