const Resource = ({resource}) => {
  return(
  <a className='max-w-sm bg-white border-2 border-dial-gray p-4 m-4 shadow-lg' href={`${principle.url}`} target='_blank'>
    <div className='flex justify-center'>
      <img className='inline use-case-filter pr-4' src={`${resource.imageUrl}`} alt={resource.imageUrl} width="100" height="100" />
    </div>
    <div className='text-center pt-3'>{resource.name}</div>
  </a>)
}

export default Resource