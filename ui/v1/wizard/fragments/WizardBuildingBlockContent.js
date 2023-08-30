import { useContext } from 'react'
import { WizardContext, WizardDispatchContext } from '../WizardContext'
import { BuildingBlockMultiSelect } from '../parameters/BuildingBlock'

const WizardBuildingBlockContent = () => {
  const { buildingBlocks } = useContext(WizardContext)
  const { setBuildingBlocks } = useContext(WizardDispatchContext)

  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='flex flex-col gap-y-6'>
        <hr className='border-b border-4 border-dial-blue-chalk' />
        <BuildingBlockMultiSelect
          buildingBlocks={buildingBlocks}
          setBuildingBlocks={setBuildingBlocks}
        />
      </div>
    </div>
  )
}

export default WizardBuildingBlockContent
