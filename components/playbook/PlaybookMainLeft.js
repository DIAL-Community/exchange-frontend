import PlaybookListLeft from './fragments/PlaybookListLeft'
import PlaybookSimpleLeft from './fragments/PlaybookSimpleLeft'

const PlaybookMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <PlaybookListLeft /> }
      { activeTab === 1 && <PlaybookSimpleLeft />}
      { activeTab === 2 && <PlaybookSimpleLeft /> }
    </>
  )
}

export default PlaybookMainLeft
