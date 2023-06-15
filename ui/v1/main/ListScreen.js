import Ribbon from '../shared/Ribbon'
import TabNav from '../shared/TabNav'

const ListScreen = () => {
  return (
    <div className='flex flex-col'>
      <Ribbon ribbonColor='bg-dial-blue-chalk' />
      <TabNav />
      <div className='h-[70vh] px-32 pt-8'>Some use case information goes here</div>
    </div>
  )
}

export default ListScreen
