import DpiAdminTabs from './DpiAdminTabs'

const DpiAdminBroadcast = () => {
  return (
    <div className='px-4 lg:px-8 xl:px-56 h-[80vh] py-8'>
      <div class="md:flex md:h-full">
        <DpiAdminTabs />
        <div class="p-12 text-medium text-gray-400 bg-gray-800 rounded-lg w-full h-full">
          <h1>DpiAdminBroadcast</h1>
        </div>
      </div>
    </div>
  )
}

export default DpiAdminBroadcast
