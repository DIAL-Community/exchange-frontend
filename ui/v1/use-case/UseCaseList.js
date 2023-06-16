import UseCaseListLeft from './UseCaseListLeft'
import UseCaseListRight from './UseCaseListRight'

const UseCaseList = () => {
  return (
    <div className='h-[70vh] px-48'>
      <div className='flex flex-row gap-x-4'>
        <UseCaseListLeft />
        <UseCaseListRight />
      </div>
    </div>
  )
}

export default UseCaseList
