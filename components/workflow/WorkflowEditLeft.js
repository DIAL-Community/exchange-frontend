import WorkflowDetailHeader from './fragments/WorkflowDetailHeader'

const WorkflowEditLeft = ({ workflow }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <WorkflowDetailHeader workflow={workflow}/>
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default WorkflowEditLeft
