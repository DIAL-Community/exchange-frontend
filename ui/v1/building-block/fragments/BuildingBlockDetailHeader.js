import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const BuildingBlockDetailHeader = ({ buildingBlock }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-ochre font-semibold'>
        {buildingBlock.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded'>
        {buildingBlock.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='w-20 h-20 px-1 py-1 rounded-full bg-dial-orange'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.buildingBlock.label') })}
              className='object-contain dial-ochre-filter w-14 h-14 mx-auto my-2 white-filter'
            />
          </div>
        }
        {buildingBlock.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-20 h-20'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.buildingBlock.label') })}
              className='object-contain dial-ochre-filter'
            />
          </div>
        }
      </div>
      {buildingBlock.specUrl &&
        <div className='flex flex-col gap-y-3 text-dial-sapphire'>
          <div className='text-sm font-semibold'>
            Specification for Building blocks
          </div>
          <div className='text-sm text-dial-stratos'>
            GovStack is defining the technical specifications that define each building block.
            They aim to facilitate access to and awareness of proven solutions that prioritize
            interoperability and open standards.
          </div>
          <div className='text-sm text-dial-stratos'>
            <a href={buildingBlock.specUrl} className='hover:border-b hover:border-dial-slate-300'>
              View the specification
            </a>
          </div>
        </div>
      }
    </div>
  )
}

export default BuildingBlockDetailHeader