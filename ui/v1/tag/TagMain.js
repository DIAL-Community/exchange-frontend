import TagMainLeft from './TagMainLeft'
import TagMainRight from './TagMainRight'

const TagMain = ({ activeTab }) => {
  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='grid grid-cols-3 gap-x-8'>
        <div className='hidden xl:block col-span-1'>
          <TagMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-3 xl:col-span-2'>
          <TagMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default TagMain
