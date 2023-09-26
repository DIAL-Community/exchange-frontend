import StorefrontDefinition from './fragments/StorefrontDefinition'
import StorefrontListRight from './fragments/StorefrontListRight'
import StorefrontForm from './fragments/StorefrontForm'

const StorefrontMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <StorefrontListRight /> }
      { activeTab === 1 && <StorefrontDefinition /> }
      { activeTab === 2 && <StorefrontForm /> }
    </div>
  )
}

export default StorefrontMainRight
