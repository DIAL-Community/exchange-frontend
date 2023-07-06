import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const ToolDefinition = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='px-8 xl:px-56 text-dial-stratos'>
      <div className='flex flex-col gap-y-8'>
        <div className='text-2xl font-semibold'>
          Let’s get started ...
        </div>
        <div className='text-sm max-w-prose'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Aliquam at cursus est, luctus vestibulum urna. Phasellus quis dolor enim.
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='rounded-md shadow-lg border'>
            <div className='px-8 py-6'>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-row gap-x-3'>
                  <img
                    src='/ui/v1/use-case-header.svg'
                    alt={format('ui.image.logoAlt', { name: 'Use Cases' })}
                    width={50}
                    height={50}
                    className='object-contain'
                  />
                  <div className='text-lg font-light text-dial-blueberry my-auto flex-grow'>
                    {format('ui.useCase.header')}
                  </div>
                </div>
                <div className='text-sm'>
                  A Use Case defines the steps that an individual or system will
                  undertake in order to achieve a business objective.
                </div>
              </div>
            </div>
          </div>
          <div className='rounded-md shadow-lg border'>
            <div className='px-8 pt-6 pb-12'>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-row gap-x-3'>
                  <img
                    src='/ui/v1/building-block-header.svg'
                    alt={format('ui.image.logoAlt', { name: 'Use Cases' })}
                    width={50}
                    height={50}
                    className='object-contain'
                  />
                  <div className='text-lg font-light text-dial-ochre my-auto flex-grow'>
                    {format('ui.buildingBlock.header')}
                  </div>
                </div>
                <div className='text-sm'>
                  Building blocks form the foundations of Use cases and are enterprise-ready,
                  reusable software components providing key functionality facilitating generic
                  WorkFlows across multiple sectors.
                </div>
              </div>
            </div>
          </div>
          <div className='rounded-md shadow-lg border'>
            <div className='px-8 py-6'>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-row gap-x-3'>
                  <img
                    src='/ui/v1/product-header.svg'
                    alt={format('ui.image.logoAlt', { name: 'Use Cases' })}
                    width={50}
                    height={50}
                    className='object-contain'
                  />
                  <div className='text-lg font-light text-dial-meadow my-auto flex-grow'>
                    {format('ui.product.header')}
                  </div>
                </div>
                <div className=''>
                  A Product is a specific technology offering that is designed to implement
                  one or more Building Blocks.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToolDefinition
