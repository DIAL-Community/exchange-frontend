import Link from 'next/link'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const ToolDefinition = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='lg:px-8 xl:px-56 text-dial-stratos'>
      <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-8'>
        <div className='text-2xl font-semibold'>
          {format('ui.tool.getStarted')} ...
        </div>
        <div className='text-sm max-w-5xl'>
          {format('ui.govstack.tagLine')}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <Link href='/use-cases?shareCatalog=true&showGovStackOnly=true' className='rounded-md shadow-lg border'>
            <div className='px-8 py-6'>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-row gap-x-3'>
                  <img
                    src='/ui/v1/use-case-header.svg'
                    alt={format('ui.image.logoAlt', { name: format('ui.useCase.label') })}
                    width={50}
                    height={50}
                    className='object-contain'
                  />
                  <div className='text-lg font-light text-dial-blueberry my-auto flex-grow'>
                    {format('ui.useCase.header')}
                  </div>
                </div>
                <div className='text-sm'>
                  {format('useCase.hint.subtitle')}
                </div>
              </div>
            </div>
          </Link>
          <Link href='/building-blocks?shareCatalog=true&showGovStackOnly=true' className='rounded-md shadow-lg border'>
            <div className='px-8 pt-6 pb-12'>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-row gap-x-3'>
                  <img
                    src='/ui/v1/building-block-header.svg'
                    alt={format('ui.image.logoAlt', { name: format('ui.buildingBlock.label') })}
                    width={50}
                    height={50}
                    className='object-contain'
                  />
                  <div className='text-lg font-light text-dial-ochre my-auto flex-grow'>
                    {format('ui.buildingBlock.header')}
                  </div>
                </div>
                <div className='text-sm'>
                  {format('buildingBlock.hint.subtitle')}
                </div>
              </div>
            </div>
          </Link>
          <Link href='/products?shareCatalog=true&showGovStackOnly=true' className='rounded-md shadow-lg border'>
            <div className='px-8 py-6'>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-row gap-x-3'>
                  <img
                    src='/ui/v1/product-header.svg'
                    alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                    width={50}
                    height={50}
                    className='object-contain'
                  />
                  <div className='text-lg font-light text-dial-meadow my-auto flex-grow'>
                    {format('ui.product.header')}
                  </div>
                </div>
                <div className='text-sm'>
                  {format('product.hint.subtitle')}
                </div>
              </div>
            </div>
          </Link>
          <Link href='/opportunities?shareCatalog=true&showGovStackOnly=true' className='rounded-md shadow-lg border'>
            <div className='px-8 py-6'>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-row gap-x-3'>
                  <img
                    src='/ui/v1/opportunity-header.svg'
                    alt={format('ui.image.logoAlt', { name: format('ui.opportunity.label') })}
                    width={50}
                    height={50}
                    className='object-contain'
                  />
                  <div className='text-lg font-light text-dial-meadow my-auto flex-grow'>
                    {format('ui.opportunity.header')}
                  </div>
                </div>
                <div className='text-sm'>
                  {format('opportunity.hint.subtitle')}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ToolDefinition
