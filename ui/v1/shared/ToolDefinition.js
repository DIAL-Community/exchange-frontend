import Link from 'next/link'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { REBRAND_BASE_PATH } from '../utils/constants'

const ToolDefinition = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='px-8 xl:px-56 text-dial-stratos'>
      <div className='flex flex-col gap-y-8'>
        <div className='text-2xl font-semibold'>
          {format('ui.tool.getStarted')} ...
        </div>
        <div className='text-sm max-w-prose'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Aliquam at cursus est, luctus vestibulum urna. Phasellus quis dolor enim.
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <Link href={`${REBRAND_BASE_PATH}/use-cases`} className='rounded-md shadow-lg border'>
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
          <Link href={`${REBRAND_BASE_PATH}/building-blocks`} className='rounded-md shadow-lg border'>
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
          <Link href={`${REBRAND_BASE_PATH}/products`} className='rounded-md shadow-lg border'>
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
                <div className=''>
                  {format('product.hint.subtitle')}
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
