import WorkflowMainLeft from './WorkflowMainLeft'
import WorkflowMainRight from './WorkflowMainRight'

const WorkflowMain = ({ activeTab }) => {
  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='grid grid-cols-3 gap-x-8'>
        <div className='hidden xl:block col-span-1'>
          <WorkflowMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-3 xl:col-span-2'>
          <WorkflowMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default WorkflowMain
