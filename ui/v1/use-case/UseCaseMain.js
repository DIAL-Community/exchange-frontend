import UseCaseMainLeft from './UseCaseMainLeft'
import UseCaseMainRight from './UseCaseMainRight'

const UseCaseList = ({ activeTab }) => {
  return (
    <div className='px-56'>
      <div className='flex flex-row gap-x-8'>
        <div className='basis-1/3'>
          <UseCaseMainLeft activeTab={activeTab} />
        </div>
        <div className='basis-2/3'>
          <UseCaseMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default UseCaseList
