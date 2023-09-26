import UseCaseListLeft from './fragments/UseCaseListLeft'
import UseCaseSimpleLeft from './fragments/UseCaseSimpleLeft'

const UseCaseMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <UseCaseListLeft /> }
      { activeTab === 1 && <UseCaseSimpleLeft />}
      { activeTab === 2 && <UseCaseSimpleLeft /> }
    </>
  )
}

export default UseCaseMainLeft
