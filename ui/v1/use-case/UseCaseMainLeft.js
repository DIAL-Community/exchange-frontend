import UseCaseListLeft from './fragments/UseCaseListLeft'

const UseCaseMainLeft = ({ activeTab }) => {
  return (
    <>
      { activeTab === 0 &&  <UseCaseListLeft /> }
      { activeTab === 1 &&  <UseCaseListLeft /> }
      { activeTab === 2 &&  <UseCaseListLeft /> }
    </>
  )
}

export default UseCaseMainLeft
