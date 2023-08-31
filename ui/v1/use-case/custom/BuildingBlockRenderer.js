import BuildingBlockCard from '../../building-block/BuildingBlockCard'
import { DisplayType, CategoryType } from '../../utils/constants'

const UseCaseBuildingBlockRenderer = ({ useCaseBuildingBlocks, stepBuildingBlocks }) => {
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
      <div className="grid grid-cols-3 gap-3">
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
              displayType={DisplayType.SMALL_CARD}
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
              displayType={DisplayType.SMALL_CARD}
            />
          )
        }
      </div>
    </div>
  )
}

export default UseCaseBuildingBlockRenderer
