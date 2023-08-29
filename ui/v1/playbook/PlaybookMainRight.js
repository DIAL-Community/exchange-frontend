import PlaybookDefinition from './fragments/PlaybookDefinition'
import PlaybookListRight from './fragments/PlaybookListRight'
import PlaybookForm from './fragments/PlaybookForm'

const PlaybookMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <PlaybookListRight /> }
      { activeTab === 1 && <PlaybookDefinition /> }
      { activeTab === 2 && <PlaybookForm /> }
    </div>
  )
}

export default PlaybookMainRight
