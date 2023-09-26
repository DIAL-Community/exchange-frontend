import ResourceListLeft from './fragments/ResourceListLeft'
import ResourceSimpleLeft from './fragments/ResourceSimpleLeft'

const ResourceMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <ResourceListLeft /> }
      { activeTab === 1 && <ResourceSimpleLeft />}
      { activeTab === 2 && <ResourceSimpleLeft /> }
    </>
  )
}

export default ResourceMainLeft
