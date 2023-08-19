import StorefrontListLeft from './fragments/StorefrontListLeft'
import StorefrontSimpleLeft from './fragments/StorefrontSimpleLeft'

const StorefrontMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <StorefrontListLeft /> }
      { activeTab === 1 && <StorefrontSimpleLeft />}
      { activeTab === 2 && <StorefrontSimpleLeft /> }
    </>
  )
}

export default StorefrontMainLeft
