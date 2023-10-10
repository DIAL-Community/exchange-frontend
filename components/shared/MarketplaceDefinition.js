import Link from 'next/link'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const MarketplaceDefinition = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  return (
    <div className='bg-dial-blueberry'>
      <div className='lg:px-8 xl:px-56 pt-8 pb-12 text-white'>
        <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3'>
          <div className='text-2xl font-semibold'>
            {format('ui.exchange.title')}
          </div>
          <div className='text-sm max-w-5xl'>
            {format('ui.marketplace.tagLine')}
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-3 py-8 -mx-6'>
            <Link href='/opportunities' className='hover:text-dial-biscotti'>
              <div className='flex flex-col gap-3 hover:bg-dial-blueberry-dark px-6 py-4 rounded-md'>
                <div className='text-lg font-semibold'>
                  {format('ui.opportunity.header')}
                </div>
                <div className='text-sm'>
                  {format('ui.opportunity.tagLine')}
                </div>
                <div className='text-sm'>
                  {format('ui.opportunity.subTagLine')}
                </div>
              </div>
            </Link>
            <Link href='/storefronts' className='hover:text-dial-biscotti'>
              <div className='flex flex-col gap-3 hover:bg-dial-blueberry-dark px-6 py-4 rounded-md'>
                <div className='text-lg font-semibold'>
                  {format('ui.storefront.header')}
                </div>
                <div className='text-sm'>
                  {format('ui.storefront.tagLine')}
                </div>
                <div className='text-sm'>
                  {format('ui.storefront.subTagLine')}
                </div>
              </div>
            </Link>
            <Link href='/products' className='hover:text-dial-biscotti'>
              <div className='flex flex-col gap-3 hover:bg-dial-blueberry-dark px-6 py-4 rounded-md'>
                <div className='text-lg font-semibold'>
                  {format('ui.compareTool.header')}
                </div>
                <div className='text-sm'>
                  {format('ui.compareTool.tagLine')}
                </div>
                <div className='text-sm'>
                  {format('ui.compareTool.subTagLine')}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketplaceDefinition
