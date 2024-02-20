import ResourceTopicListLeft from './fragments/ResourceTopicListLeft'
import ResourceTopicSimpleLeft from './fragments/ResourceTopicSimpleLeft'

const ResourceTopicMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <ResourceTopicListLeft /> }
      { activeTab === 1 && <ResourceTopicSimpleLeft />}
    </>
  )
}

export default ResourceTopicMainLeft
