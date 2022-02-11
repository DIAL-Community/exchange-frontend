import UseCaseHint from './hint/UseCaseHint'
import WorkflowHint from './hint/WorkflowHint'
import BuildingBlockHint from './hint/BuildingBlockHint'
import ProductHint from './hint/ProductHint'
import ProjectHint from './hint/ProjectHint'
import OrganizationHint from './hint/OrganizationHint'
import SDGHint from './hint/SDGHint'

const FilterHint = (props) => {
  const { activeTab } = props

  return (
    <div className='bg-dial-gray-dark flex-auto'>
      <div className='px-2'>
        {activeTab === 0 && <SDGHint {...props} />}
        {activeTab === 1 && <UseCaseHint {...props} />}
        {activeTab === 2 && <WorkflowHint {...props} />}
        {activeTab === 3 && <BuildingBlockHint {...props} />}
        {activeTab === 4 && <ProductHint {...props} />}
        {activeTab === 5 && <ProjectHint {...props} />}
        {activeTab === 6 && <OrganizationHint {...props} />}
      </div>
    </div>
  )
}

export default FilterHint
