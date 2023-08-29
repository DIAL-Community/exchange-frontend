import RubricCategoryListLeft from './fragments/RubricCategoryListLeft'
import RubricCategorySimpleLeft from './fragments/RubricCategorySimpleLeft'

const RubricCategoryMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <RubricCategoryListLeft /> }
      { activeTab === 1 && <RubricCategorySimpleLeft />}
      { activeTab === 2 && <RubricCategorySimpleLeft /> }
    </>
  )
}

export default RubricCategoryMainLeft
