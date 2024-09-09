import ResourceDetailHeader from './fragments/ResourceDetailHeader'

const ResourceEditLeft = ({ candidateResource }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <ResourceDetailHeader candidateResource={candidateResource}/>
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default ResourceEditLeft
