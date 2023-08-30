import CategoryIndicatorDefinition from './fragments/CategoryIndicatorDefinition'
import CategoryIndicatorForm from './fragments/CategoryIndicatorForm'
import CategoryIndicatorListRight from './fragments/CategoryIndicatorListRight'

const CategoryIndicatorMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <CategoryIndicatorListRight /> }
      { activeTab === 1 && <CategoryIndicatorDefinition /> }
      { activeTab === 2 && <CategoryIndicatorForm /> }
    </div>
  )
}

export default CategoryIndicatorMainRight
