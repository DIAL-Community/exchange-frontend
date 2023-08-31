import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { CategoryType } from '../../utils/constants'

const BuildingBlockDetailHeader = ({ buildingBlock }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-ochre font-semibold'>
        {buildingBlock.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded border'>
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
            {format('ui.buildingBlock.specification')}
          </div>
          <div className='text-sm text-dial-stratos'>
            {format('ui.buildingBlock.specification.description')}
          </div>
          <div className='flex gap-x-2 text-sm text-dial-stratos'>
            <a
              href={buildingBlock.specUrl}
              target='_blank'
              rel='noreferrer'
              className='flex border-b border-dial-iris-blue'
            >
              {format('ui.buildingBlock.specification.view')}
            </a>
            ⧉
          </div>
        </div>
      }
      <div className='flex gap-x-3'>
        <div className='flex flex-col gap-y-3 text-sm grow shrink-0'>
          <div className='font-semibold text-dial-sapphire'>
            {format('buildingBlock.maturity')}
          </div>
          <div className='flex text-dial-stratos'>
            {buildingBlock.maturity}
          </div>
        </div>
        <div className='flex flex-col gap-y-3 text-sm grow shrink-0'>
          <div className='font-semibold text-dial-sapphire'>
            {format('ui.buildingBlock.category')}
          </div>
          <div className='flex text-dial-stratos'>
            {buildingBlock.category ?? CategoryType.FUNCTIONAL}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuildingBlockDetailHeader
