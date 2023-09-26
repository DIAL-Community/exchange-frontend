import ResourceListRight from './fragments/ResourceListRight'
import ResourceForm from './fragments/ResourceForm'

const ResourceMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <ResourceListRight /> }
      { activeTab === 1 && <ResourceForm /> }
    </div>
  )
}

export default ResourceMainRight
