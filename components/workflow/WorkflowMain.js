import WorkflowMainLeft from './WorkflowMainLeft'
import WorkflowMainRight from './WorkflowMainRight'

const WorkflowMain = ({ activeTab }) => {
  return (
    <div className='px-4 lg:px-8 xl:px-24 3xl:px-56'>
      <div className='grid grid-cols-4 gap-x-8'>
        <div className='hidden md:block col-span-1'>
          <WorkflowMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-4 md:col-span-3'>
          <WorkflowMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default WorkflowMain
