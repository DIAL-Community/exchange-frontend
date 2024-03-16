const DpiTopicDetail = ({ resourceTopic }) => {
  return (
    <div className='flex flex-col gap-5'>
      <div className='text-lg font-semibold'>
        {resourceTopic.name}
      </div>
      <div className='grid grid-cols-3 gap-3'>
        {resourceTopic.resources.map((resource, index) => {
          return (
            <div className='p-4 border rounded' key={index}>
              <div className='line-clamp-2 overflow-auto'>
                {resource.name}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DpiTopicDetail
