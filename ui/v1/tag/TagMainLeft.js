import TagListLeft from './fragments/TagListLeft'
import TagSimpleLeft from './fragments/TagSimpleLeft'

const TagMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <TagListLeft /> }
      { activeTab === 1 && <TagSimpleLeft />}
      { activeTab === 2 && <TagSimpleLeft /> }
    </>
  )
}

export default TagMainLeft
