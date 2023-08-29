import CategoryIndicatorListLeft from './fragments/CategoryIndicatorListLeft'
import CategoryIndicatorSimpleLeft from './fragments/CategoryIndicatorSimpleLeft'

const CategoryIndicatorMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <CategoryIndicatorListLeft /> }
      { activeTab === 1 && <CategoryIndicatorSimpleLeft />}
      { activeTab === 2 && <CategoryIndicatorSimpleLeft /> }
    </>
  )
}

export default CategoryIndicatorMainLeft
