const Resource = ({ resource }) => {
  return (
    <a href={`${resource.link}`} target='_blank' rel='noreferrer'>
      <div className='max-w-sm max-h-64 h-64 text-ellipsis overflow-hidden bg-white border-4 border-dial-gray p-4 m-4 shadow-lg hover:border-dial-yellow hover:text-dial-yellow'>
        <div className='text-center pb-3'>{resource.name}</div>
        <div className='flex justify-center'>
          {
            resource.imageUrl === ''
              ? <div className='text-2xl font-bold'>{resource.name}</div>
              : <img className='inline mx-auto h-28' src={`${resource.imageUrl}`} alt={resource.imageUrl} />
          }
        </div>
        <div className='text-xs pt-3'>{resource.description}</div>
      </div>
    </a>
  )
}

export default Resource
