import UseCaseMainLeft from './UseCaseMainLeft'
import UseCaseMainRight from './UseCaseMainRight'

const UseCaseMain = ({ activeTab }) => {
  return (
    <div className='px-8 xl:px-56'>
      <div className='grid grid-cols-3 gap-x-8'>
        <div className='hidden xl:block col-span-1'>
          <UseCaseMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-3 xl:col-span-2'>
          <UseCaseMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default UseCaseMain
