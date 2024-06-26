import DpiAdminTabs from './DpiAdminTabs'

const DpiAdminSetting = () => {
  return (
    <div className='px-4 lg:px-8 xl:px-56 min-h-[80vh] py-8'>
      <div className="md:flex md:h-full">
        <DpiAdminTabs />
        <div className="p-12 text-medium text-dial-slate-400 bg-dial-slate-800 rounded-lg w-full h-full">
          <h1>DpiAdminSetting</h1>
        </div>
      </div>
    </div>
  )
}

export default DpiAdminSetting
