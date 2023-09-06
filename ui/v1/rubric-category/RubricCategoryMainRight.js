import RubricCategoryForm from './fragments/RubricCategoryForm'
import RubricCategoryListRight from './fragments/RubricCategoryListRight'

const RubricCategoryMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <RubricCategoryListRight /> }
      { activeTab === 1 && <RubricCategoryForm /> }
    </div>
  )
}

export default RubricCategoryMainRight
