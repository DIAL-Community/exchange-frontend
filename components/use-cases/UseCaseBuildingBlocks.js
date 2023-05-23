import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { CategoryType } from '../../lib/constants'

const containerElementStyle = classNames(
  'cursor-pointer hover:rounded-lg hover:shadow-lg',
  'border-2 border-transparent hover:border-dial-sunshine'
)

const UseCaseBuildingBlock = ({ useCaseBuildingBlocks, stepBuildingBlocks }) => {
  const containsBuildingBlock = (stepBuildingBlocks, buildingBlock) =>
    stepBuildingBlocks &&
    !stepBuildingBlocks
      .filter(stepBuildingBlock => stepBuildingBlock.slug === buildingBlock.slug)
      .length > 0

  const isDPI = (buildingBlock) => buildingBlock.category === CategoryType.DPI
  const categoryNonDPI = useCaseBuildingBlocks.filter(buildingBlock => !isDPI(buildingBlock))
  const categoryDPI = useCaseBuildingBlocks.filter(buildingBlock => isDPI(buildingBlock))

  return (
    <div className='flex flex-col gap-3'>
      <div className="grid grid-cols-3">
        {Array(3 - (categoryNonDPI.length % 3))
          .fill()
          .map((_, index) => <div key={index} />)
        }
        {categoryNonDPI
          .map((buildingBlock, index) =>
            <BuildingBlockCard
              key={index}
              buildingBlock={buildingBlock}
              disabled={containsBuildingBlock(stepBuildingBlocks, buildingBlock)}
            />
          )
        }
      </div>
      <div className='border-b border-dashed border-dial-lavender' />
      <div className="grid grid-cols-1">
        {categoryDPI
          .map((buildingBlock, index) =>
            <BuildingBlockCard
              key={index}
              buildingBlock={buildingBlock}
              disabled={containsBuildingBlock(stepBuildingBlocks, buildingBlock)}
            />
          )
        }
      </div>
    </div>
  )
}

const BuildingBlockCard = ({ buildingBlock, disabled }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <Link href={`/building_blocks/${buildingBlock.slug}`}>
      <div className={containerElementStyle}>
        <div className='bg-white border border-dial-gray shadow-lg rounded-md'>
          <div className={`flex flex-row flex-wrap px-4 py-3 ${disabled && 'opacity-20'}`}>
            <div className='flex gap-2 my-auto text-dial-sapphire'>
              <div className='block w-8 relative opacity-80'>
                <Image
                  fill
                  className='object-contain'
                  alt={format('image.alt.logoFor', { name: buildingBlock.name })}
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
                />
              </div>
              {buildingBlock.name}
            </div>
            <div className='ml-auto flex gap-2 text-white'>
              <div className='bg-dial-lavender rounded text-sm px-2 py-1'>{buildingBlock.maturity}</div>
              {buildingBlock.category === CategoryType.DPI &&
                <div className='bg-dial-blueberry rounded text-sm px-2 py-1'>{buildingBlock.category}</div>
              }
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default UseCaseBuildingBlock
