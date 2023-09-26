import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import UseCaseList from './results/UseCaseList'
import ProductList from './results/ProductList'
import BuildingBlockList from './results/BuildingBlockList'
import ProjectList from './results/ProjectList'
import DatasetList from './results/DatasetList'
import WizardExtendedData from './fragments/WizardExtendedData'

const WizardResultRight = forwardRef((_props, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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

  const scrollToTop = (e) => {
    e.preventDefault()
    window.scrollTo(0, 0)
  }

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        <UseCaseList headerRef={useCaseRef} />
        <ProductList headerRef={productRef} />
        <BuildingBlockList headerRef={buildingBlockRef} />
        <ProjectList headerRef={projectRef} />
        <DatasetList headerRef={datasetRef} />
        <WizardExtendedData />
        <div className='mx-auto text-sm'>
          <a href='#' onClick={scrollToTop} className='border-b border-dial-iris-blue'>
            {format('ui.common.scrollToTop')}
          </a>
        </div>
      </div>
    </div>
  )
})

WizardResultRight.displayName = 'WizardResultRight'

export default WizardResultRight
