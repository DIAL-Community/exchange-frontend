import Link from 'next/link'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const MarketplaceDefinition = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  return (
    <div className='bg-dial-blueberry'>
      <div className='lg:px-8 xl:px-56 pt-8 pb-12 text-white'>
        <div className='flex flex-col gap-y-3'>
          <div className='text-2xl font-semibold'>
            {format('ui.exchange.title')}
          </div>
          <div className='text-sm max-w-prose'>
            {format('ui.marketplace.tagLine')}
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-3 py-8 -mx-6'>
            <div className='flex flex-col gap-3 hover:bg-dial-blueberry-dark px-6 py-4 rounded-md'>
              <div className='text-lg font-semibold'>
                {format('ui.opportunity.header')}
              </div>
              <div className='text-sm'>
                {format('ui.opportunity.tagLine')}
              </div>
              <Link href='/opportunities' className='hover:text-dial-sunshine'>
                <div className='text-sm'>
                  {format('ui.opportunity.subTagLine')}
                </div>
              </Link>
            </div>
            <div className='flex flex-col gap-3 hover:bg-dial-blueberry-dark px-6 py-4 rounded-md'>
              <div className='text-lg font-semibold'>
                {format('ui.storefront.header')}
              </div>
              <div className='text-sm'>
                {format('ui.storefront.tagLine')}
              </div>
              <Link href='/storefronts' className='hover:text-dial-sunshine'>
                <div className='text-sm'>
                  {format('ui.storefront.subTagLine')}
                </div>
              </Link>
            </div>
            <div className='flex flex-col gap-3 hover:bg-dial-blueberry-dark px-6 py-4 rounded-md'>
              <div className='text-lg font-semibold'>
                {format('ui.compareTool.header')}
              </div>
              <div className='text-sm'>
                {format('ui.compareTool.tagLine')}
              </div>
              <a href='' className='hover:text-dial-sunshine'>
                <div className='text-sm'>
                  {format('ui.compareTool.subTagLine')}
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketplaceDefinition
