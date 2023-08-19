import PlaybookMainLeft from './PlaybookMainLeft'
import PlaybookMainRight from './PlaybookMainRight'

const PlaybookMain = ({ activeTab }) => {
  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='grid grid-cols-3 gap-x-8'>
        <div className='hidden xl:block col-span-1'>
          <PlaybookMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-3 xl:col-span-2'>
          <PlaybookMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default PlaybookMain
