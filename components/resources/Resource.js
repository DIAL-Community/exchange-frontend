const Resource = ({resource}) => {
  return(
  <a className='max-w-sm bg-white border-2 border-dial-gray p-4 m-4 shadow-lg' href={`${resource.link}`} target='_blank'>
    <div className='text-center pb-3'>{resource.name}</div>
    <div className='flex justify-center'>
      { resource.imageUrl === '' ? ( 
        <div className='text-2xl font-bold'>{resource.name}</div>
      ):(
        <img className='inline pr-4' src={`${resource.imageUrl}`} alt={resource.imageUrl} width="200" height="200" />)
      }
    </div>
    <div className='text-xs pt-3'>{resource.description}</div>
  </a>)
}

export default Resource