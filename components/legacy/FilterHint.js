import UseCaseHint from '../filter/hint/UseCaseHint'
import WorkflowHint from '../filter/hint/WorkflowHint'
import BuildingBlockHint from '../filter/hint/BuildingBlockHint'
import ProductHint from '../filter/hint/ProductHint'
import ProjectHint from '../filter/hint/ProjectHint'
import OrganizationHint from '../filter/hint/OrganizationHint'
import SDGHint from '../filter/hint/SDGHint'

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
