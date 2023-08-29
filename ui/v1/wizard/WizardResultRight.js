import { forwardRef, useImperativeHandle, useRef } from 'react'
import UseCaseList from './results/UseCaseList'
import ProductList from './results/ProductList'
import BuildingBlockList from './results/BuildingBlockList'
import ProjectList from './results/ProjectList'
import DatasetList from './results/DatasetList'

const WizardResultRight = forwardRef((_props, ref) => {
  const useCaseRef = useRef()
  const productRef = useRef()
  const buildingBlockRef = useRef()
  const projectRef = useRef()
  const datasetRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.useCase.header', ref: useCaseRef },
      { value: 'ui.product.header', ref: productRef },
      { value: 'ui.buildingBlock.header', ref: buildingBlockRef },
      { value: 'ui.project.header', ref: projectRef },
      { value: 'ui.dataset.header', ref: datasetRef }
    ],
    []
  )

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        <UseCaseList headerRef={useCaseRef} />
        <hr className='border-b border-dial-blue-chalk my-3' />
        <ProductList headerRef={productRef} />
        <hr className='border-b border-dial-blue-chalk my-3' />
        <BuildingBlockList headerRef={buildingBlockRef} />
        <hr className='border-b border-dial-blue-chalk my-3' />
        <ProjectList headerRef={projectRef} />
        <hr className='border-b border-dial-blue-chalk my-3' />
        <DatasetList headerRef={datasetRef} />
        <hr className='border-b border-dial-blue-chalk my-3' />
      </div>
    </div>
  )
})

WizardResultRight.displayName = 'WizardResultRight'

export default WizardResultRight
