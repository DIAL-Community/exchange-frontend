const ResourceRibbon = () => {
  return (
    <div
      className='rounded-b-[64px] z-40 bg-cover bg-top h-[400px] md:h-[300px]'
      style={{
        backgroundImage: 'url("/ui/v1/research-header.svg")'
      }}
    >
      <div className='lg:h-[260px] pt-[60px] md:pt-[80px] lg:pt-[20px]'>
        <div className='flex h-full items-center'>
          <div className='px-8 xl:px-56 text-4xl'>
            Research can provide a path to progress and prosperity. We aim for ours to contribute to exactly that.
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceRibbon
