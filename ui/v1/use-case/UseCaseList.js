import UseCaseListLeft from './UseCaseListLeft'
import UseCaseListRight from './UseCaseListRight'

const UseCaseList = () => {
  return (
    <div className='px-48'>
      <div className='flex flex-row gap-x-4'>
        <div className='basis-1/3'>
          <UseCaseListLeft />
        </div>
        <div className='basis-2/3'>
          <UseCaseListRight />
        </div>
      </div>
    </div>
  )
}

export default UseCaseList
