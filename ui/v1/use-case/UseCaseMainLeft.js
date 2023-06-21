import UseCaseListLeft from './UseCaseListLeft'

const UseCaseMainLeft = ({ activeTab }) => {
  return (
    <>
      { activeTab === 0 &&  <UseCaseListLeft /> }
      { activeTab === 1 &&  <UseCaseListLeft /> }
    </>
  )
}

export default UseCaseMainLeft
