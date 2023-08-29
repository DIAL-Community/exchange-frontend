import TagDefinition from './fragments/TagDefinition'
import TagListRight from './fragments/TagListRight'
import TagForm from './fragments/TagForm'

const TagMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <TagListRight /> }
      { activeTab === 1 && <TagDefinition /> }
      { activeTab === 2 && <TagForm /> }
    </div>
  )
}

export default TagMainRight
